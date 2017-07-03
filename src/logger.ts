import {EventEmitter} from 'nomatic-events';
import {Transport} from './transport';
import * as format from 'string-format';
import * as transport from './transport';

export interface LoggerEntry {
  name: string;
  level: string;
  message: string;
  date: Date;
  data?: Object;
}

/**
 * A specification of log level names and their associated priority. A lower number is given higher priority.
 * Example:
 *  ```typescript
 *  const levels: Levels = {
 *    error: 0,
 *    warn: 1,
 *    info: 2,
 *    debug: 3
 *  };
 *  ```
 *
 *  `info` has a higher priority than `debug`, but not as high as `warn`. A `Transport` with a level of `info` will
 *  execute log entries on `info`, `warn`, and `error` levels, but not on `debug`.
 */
export interface Levels {
  [key: string]: number;
}

/**
 * Options associated with a `Logger` instance. Each property is optional, and as such, have sensible defaults.
 */
export interface LoggerOptions {
  /**
   * When a log message is not defined, the data associated with it can be used to create the message.
   * For example:
   * ```javascript
   * const logger = require('nomatic-logging');
   * logger.template = '{method} {url} ==> {status} {length} bytes';
   * logger.log('info', {
   *  method: 'GET',
   *  url: '/api/v1/users?page=1',
   *  status: 200,
   *  length: 1203
   * };
   * ```
   * The `LoggerEntry` (sent on `execute` of each associated transport) would include a `message` property set to
   * `GET /api/v1/users?page=1 ==> 200 1203 bytes`.
   */
  template?: string;
  /**
   * Transports to associated with the `Logger` instance.
   */
  transports?: Transport[];
  /**
   * Default:
   * ```typescript
   * { trace: 50, debug: 40, info: 30, warn: 20, error: 10 }
   * ```
   */
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

  /**
   * `Transport` instances which are triggered in the `log` method (or a method associated with a log level).
   * @type {Array}
   */
  protected transports: Transport[] = [];
  /**
   * Child `Logger` instances.
   */
  protected children: Logger[] = [];

  /**
   * The name of a logging subject that the instance represents.
   */
  public readonly name: string;

  /**
   * The template to be used when parsing `LoggerEntry.data` for an `LoggerEntry.message`.
   * When a log message is not defined, the data associated with it can be used to create the message.
   *
   * For example:
   * ```javascript
   * const logger = require('nomatic-logging');
   * logger.template = '{method} {url} ==> {status} {length} bytes';
   * logger.log('info', {
   *  method: 'GET',
   *  url: '/api/v1/users?page=1',
   *  status: 200,
   *  length: 1203
   * };
   * ```
   * The `LoggerEntry` (sent on `execute` of each associated transport) would include a `message` property set to
   * `GET /api/v1/users?page=1 ==> 200 1203 bytes`.
   *
   * When defining a template, variables from the log LoggerEntry's data object are used. The name of the variable should
   * be contained within curly braces, i.e. '{key}' would be replaced with `value` if data has a property of `key` with
   * value of `value`.
   *
   * By default, a template is not used, so a message must be specified when calling `log` (or a method associated with
   * a log level). If `template` is defined, a message is optional, and `template` will not be used if a message is
   * defined.
   */
  public template: string = null;

  /**
   * Representation of a logging subject.
   * @param name        The name of the logging subject.
   * @param options     Options to apply to instance.
   */
  constructor(name: string = 'root', options: LoggerOptions = {}) {
    super();

    this.name = name;

    if (!options.levels) {
      options.levels = this.levels;
    }

    this.configure(options);
  }

  /**
   * Return the log levels available and their associated priority.
   * @returns {Levels}
   */
  public get levels() {
    return this._levels;
  }

  /**
   * Set the levels available for this instance. When levels are set, methods are created
   * for new levels, while levels not specified on assignment are deleted.
   * @param levels
   */
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

  /**
   * Prepares an object with all data associated with a log entry.
   * @param level     The log level associated with the LoggerEntry.
   * @param message   The message associated with the LoggerEntry.
   * @param data      Optional data to associate with the LoggerEntry.
   * @returns {LoggerEntry}
   */
  private serialize(level: string, message: string, data: Object = null) {
    const entry: LoggerEntry = {
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

  /**
   * Configure the instance at or after instantiation. All child instances will
   * also be configured with the options specified.
   * @param options: These options are the same as those accepted on instantiation.
   */
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

  /**
   * Create a child `Logger` instance.
   * @param name: The name of the child instance.
   * @param options: The options for the child instance.
   * @returns {Logger}
   */
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

  /**
   * Parse, validate, and pass a log entry to all associated transports.
   * @param level: The level of the log entry.
   * @param messageOrData: Either the message (string) or data (Object) for the log entry. Data can be parsed into a
   * message if `template` is defined on the instance.
   * @param data: Data for log entry (if no `message` is specified). Required if a message is not specified and
   * `template` is defined on the instance.
   */
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

  /**
   * Find or create a child instance. If child instance has not already been created, `options` is inherited from this
   * instance.
   * @param name: The name of the child instance.
   * @returns {Logger}
   */
  public get(name: string) {
    let result = this.find(name);

    if (!result) {
      return this.create(name);
    }

    return result;
  }

  /**
   * Register a child instance.
   * @param logger: The child logger.
   * @returns {boolean}: If `false`, child is already registered, else returns `true`.
   */
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

  /**
   * Associate a transport to the instance. Transports are executed from `log` method.
   * @param transport
   */
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

export const transport = transport;

export default new Logger(null, {
  transports: [
    transport.console
  ]
});
