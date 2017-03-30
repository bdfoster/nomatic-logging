import {Entry} from './';
import {EventEmitter} from 'nomatic-events';

export type TransportHandler = (entry: Entry) => void;

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

  public abstract execute(entry: Entry);
}

export default Transport;