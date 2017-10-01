import * as format from 'string-format';
import {LoggerEntry} from '../logger';
import {Transport, TransportOptions} from './index';

export interface ConsoleOptions extends TransportOptions {
  template?: string;
}

export class ConsoleTransport extends Transport {
  public template: string;

  constructor(options: ConsoleOptions) {
    super(options);

    this.template = options.template || '[{level}]\t{message}';
  }

  execute(entry: LoggerEntry) {
    console.log(format(this.template, entry));
  }
}

export default ConsoleTransport;
