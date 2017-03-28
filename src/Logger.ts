import * as os from 'os';
import {EventEmitter} from 'nomatic-events';
import Transport from './Transport';

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
  transports?: Transport[];
}

export class Logger extends EventEmitter {
  protected transports: Transport[] = [];
  public readonly namespace: string;

  constructor(options: LoggerOptions) {
    super();
    this.namespace = options.namespace;

    if (options.transports) {
      for (const i in options.transports) {
        this.subscribe(options.transports[i]);
      }
    }

    for (const level in levels) {
      this[level] = (message: string, data: Object) => {
        this.send(level, message, data);
      }
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

  public send(level: string, message: string, data: Object = null) {
    if (!levels.hasOwnProperty(level)) {
      throw new Error('Invalid level: ' + level);
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
