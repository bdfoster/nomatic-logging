import {EventEmitter} from 'nomatic-events';
import Transport from './Transport';
import * as format from 'string-format';
import {Entry} from './index';


export interface Levels {
  [key: string]: number;
}

export interface LoggerOptions {
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

  protected transports: Transport[] = [];
  protected children: Logger[] = [];

  public readonly name: string;
  public template: string = null;

  constructor(name: string = 'root', options: LoggerOptions = {}) {
    super();

    this.name = name;

    if (!options.levels) {
      options.levels = this.levels;
    }

    this.configure(options);
  }

  public get levels() {
    return this._levels;
  }

  public set levels(levels: Levels) {
    for (const level in this._levels) {
      if (!levels.hasOwnProperty(level) && this[level]) {
        delete this[level];
      }
    }

    for (const level in levels) {
      if (!this[level]) {
        this[level] = (messageOrData: string | Object, data?: Object) => {
          return this.log(level, messageOrData, data);
        }
      }
    }

    this._levels = levels;

    for (const child of this.children) {
      child.levels = levels;
    }
  }

  private serialize(level: string, message: string, data: Object = null) {
    const entry: Entry = {
      name: this.name,
      message: message,
      level: level,
      date: new Date()
    };

    if (data) {
      entry.data = data;
    }

    return entry;
  }

  public configure(options: LoggerOptions) {
    if (options.transports) {
      this.transports = [];
      for (const i in options.transports) {
        this.use(options.transports[i]);
      }
    }

    if (options.template) {
      this.template = options.template;
    }

    if(options.levels) {
      this.levels = options.levels;
    }

    for (const child of this.children) {
      child.configure(options);
    }
  }

  public create(name: string, options: LoggerOptions = {}) {
    if (!options.transports) {
      options.transports = this.transports;
    }

    if (!options.levels) {
      options.levels = this.levels;
    }

    const logger = new Logger(name, options);
    this.register(logger);
    return logger;
  }

  public find(name: string) {
    for (const i in this.children) {
      if (this.children[i].name === name) {
        return this.children[i];
      }
    }

    return null;
  }

  public log(level: string, messageOrData: string | Object, data?: Object) {
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
    this.emit(level, entry);
    this.emit('entry', entry);

    for (const transport of this.transports) {
      if (this.levels[entry.level] <= this.levels[transport.level]) {
        transport.execute(entry);
      }
    }
  }

  public get(name: string) {
    let result = this.find(name);

    if (!result) {
      return this.create(name);
    }

    return result;
  }

  public register(logger: Logger) {
    if (this.children.indexOf(logger) === -1) {
      for (const child of this.children) {
        if (child.name === logger.name) {
          throw new Error('Child already exists with name "' + logger.name + '"');
        }
      }
      this.children.push(logger);
      return true;
    }
    return false;
  }

  public use(transport: Transport) {
    if (this.transports.indexOf(transport) !== -1) {
      return;
    }

    if (transport.level && !this.levels[transport.level]) {
      throw new Error('Transport specifies invalid `level`: ' + transport.level);
    }

    this.transports.push(transport);

    for (const child of this.children) {
      child.use(transport);
    }
  }
}

export default Logger;
