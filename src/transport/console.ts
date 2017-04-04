import {Transport, TransportOptions} from './index';
import * as format from 'string-format';
import {LoggerEntry} from '../logger';

export interface ConsoleOptions extends TransportOptions {
  template?: string;
}

export class Console extends Transport {
  public template: string;

  constructor(options: ConsoleOptions) {
    super(options);

    this.template = options.template || '[{level}]\t{message}';
  }

  execute(entry: LoggerEntry) {
    console.log(format(this.template, entry));
  }
}

export default new Console({
  level: 'info'
});