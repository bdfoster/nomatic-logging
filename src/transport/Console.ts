import {Transport, TransportOptions} from '../Transport';
import * as format from 'string-format';
import {Entry} from '../index';

export interface ConsoleOptions extends TransportOptions {
  template?: string;
}

export class Console extends Transport {
  public template: string;

  constructor(options: ConsoleOptions) {
    super(options);

    this.template = options.template || '[{level.name}]\t{message}';
  }

  execute(entry: Entry) {
    console.log(format(this.template, entry));
  }
}

export default Console;