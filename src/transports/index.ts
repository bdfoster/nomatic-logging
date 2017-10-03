import {EventEmitter} from 'nomatic-events';
import {LoggerEntry} from '../../src';

export interface TransportOptions {
  level?: string;
  [key: string]: any;
}

export abstract class Transport extends EventEmitter {
  public level: string;

  constructor(options: TransportOptions = {}) {
    super();
    this.level = options.level || null;
  }

  public abstract execute(entry: LoggerEntry);
}
