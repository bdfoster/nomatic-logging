import * as os from 'os';
import {EventEmitter} from 'nomatic-events';
import Transport from './Transport';
import * as format from 'string-format';

export interface Entry {
  namespace?: string;
  level: string;
  message: string;
  createdAt: Date;
  hostname: string;
  data?: Object;
}

export interface Levels {
  [key: string]: number;
}

export interface LoggerOptions {
  namespace?: string;
  level?: string;
  template?: string;
  transports?: Transport[];
  levels?: Levels;
}

export class Logger extends EventEmitter {
  private _levels: Levels = {
    trace: 50,
    debug: 40,
    info: 30,
    warn: 20,
    error: 10
  };
  private _namespace: string = null;
  protected transports: Transport[] = [];

  public template: string = null;


  constructor(options: LoggerOptions = {}) {
    super();

    if (!options.levels) {
      options.levels = this.levels;
    }

    this.configure(options);
  }

  public get levels() {
    return this._levels;
  }

  public set levels(value: Levels) {
    for (const level in this._levels) {
      if (!value.hasOwnProperty(level) && this[level]) {
        delete this[level];
      }
    }

    for (const level in value) {
      if (!this[level]) {
        this[level] = (messageOrData: string | Object, data?: Object) => {
          return this.send(level, messageOrData, data);
        }
      }
    }
  }

  public get namespace() {
    return this._namespace;
  }

  public set namespace(value: string) {
    this._namespace = value;
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

  public configure(options: LoggerOptions) {
    if (options.namespace) {
      this.namespace = options.namespace;
    }

    if (options.transports) {
      for (const i in options.transports) {
        this.subscribe(options.transports[i]);
      }
    }

    if (options.template) {
      this.template = options.template;
    }

    if(options.levels) {
      this.levels = options.levels;
    }
  }

  public send(level: string, messageOrData: string | Object, data?: Object) {
    let message: string;
    if (!this.levels.hasOwnProperty(level)) {
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
      transport.push(entry, this);
    })
  }
}

export default Logger;
