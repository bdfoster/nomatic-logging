import * as os from 'os';
import {EventEmitter} from 'nomatic-events';
import Transport from './Transport';
import * as format from 'string-format';
import * as util from 'util';

export interface Entry {
  namespace: string;
  level: string;
  message: string;
  createdAt: Date;
  hostname: string;
  data?: Object;
}

export interface Levels {
  [key: string]: number;
}

export const levels: Levels = {
  trace: 50,
  debug: 40,
  info: 30,
  warn: 20,
  error: 10
};


export interface LoggerOptions {
  namespace: string;
  level?: string;
  template?: string;
  transports?: Transport[];
}

export class Logger extends EventEmitter {
  protected transports: Transport[] = [];
  public readonly namespace: string;
  public template: string = null;

  constructor(options: LoggerOptions) {
    super();
    this.namespace = options.namespace;

    if (options.transports) {
      for (const i in options.transports) {
        this.subscribe(options.transports[i]);
      }
    }

    if (options.template) {
      this.template = options.template;
    }

    for (const level in levels) {
      this[level] = (messageOrData: string | Object, data?: Object) => {
        return this.send(level, messageOrData, data);
      };
    }
  }

  private serialize(level: string, message: string, data: Object = null) {
    const entry: Entry = {
      namespace: this.namespace,
      message: message,
      level: level,
      hostname: os.hostname(),
      createdAt: new Date()
    };

    if (data) {
      entry.data = data;
    }

    return entry;
  }

  public send(level: string, messageOrData: string | Object, data?: Object) {
    let message: string;
    if (!levels.hasOwnProperty(level)) {
      throw new Error('Invalid level: ' + level);
    }

    if (typeof messageOrData !== 'string') {
      if (!this.template) {
        throw new Error('`message` is not specified and `template` is not defined');
      } else {
        message = format(this.template, messageOrData);
        data = messageOrData;
      }
    } else {
      message = messageOrData;
    }

    const entry = this.serialize(level, message, data);
    this.emit('entry', entry);
    this.emit(level, entry);
  }

  public subscribe(transport: Transport) {
    if (this.transports.indexOf(transport) !== -1) {
      throw new Error('Transport already subscribed to "' + this.namespace + '" namespace');
    }

    this.transports.push(transport);

    this.on('entry', (entry) => {
      transport.push(entry);
    })
  }
}

export default Logger;
