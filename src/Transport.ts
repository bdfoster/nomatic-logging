import {Entry, levels} from './';

export type TransportHandler = (entry: Entry) => void;

export interface TransportOptions {
  level: string;
  handler: TransportHandler;
  [key: string]: any;
}

export class Transport {
  private _level: string;
  private _handler: (entry: Entry) => void;

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

  public get level() {
    return this._level;
  }

  public set level(value: string) {
    if (!levels.hasOwnProperty(value)) {
      throw new Error('Invalid level: ' + value);
    }

    this._level = value;
  }

  public push(entry: Entry) {
    if (levels[entry.level] <= levels[this.level]) {
      this.handler(entry);
    }
  }
}

export default Transport;