import {Entry, Logger} from './';

export type TransportHandler = (entry: Entry) => void;

export interface TransportOptions {
  level: string;
  handler: TransportHandler;
  [key: string]: any;
}

export class Transport {
  private _handler: (entry: Entry) => void;
  public level: string;

  constructor(options: TransportOptions) {
    this.level = options.level;
    this.handler = options.handler;
  }

  public get handler(): TransportHandler {
    return this._handler;
  }

  public set handler(value: TransportHandler) {
    this._handler = value;
  }

  public push(entry: Entry, logger: Logger) {
    if (!logger.levels.hasOwnProperty(entry.level)) {
      throw new Error('Invalid level: ' + entry.level);
    }
    if (logger.levels[entry.level] <= logger.levels[this.level]) {
      this.handler(entry);
    }
  }
}

export default Transport;