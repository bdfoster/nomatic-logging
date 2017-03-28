
import {Entry, levels} from './';
import {EventListener} from 'nomatic-events';


export interface TransportOptions {
  level: string;
}

export interface TransportListeners {
  [key: string]: EventListener;
}

export abstract class Transport {
  private _level: string;

  constructor(options: TransportOptions) {
    this.level = options.level;
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

  public abstract send(entry: Entry): void;

  public push(entry: Entry) {
    if (levels[entry.level] <= levels[this.level]) {
      this.send(entry);
    }
  }
}

export default Transport;