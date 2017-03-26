import Transport from '../Transport';
import * as formatter from 'string-format';
import {Entry} from '../';

export interface ConsoleOptions {
  format?: string;
}

export class Console extends Transport {
  public format: string = null;
  public init(options: ConsoleOptions) {
    this.format = options.format || '[{level}]\t {message}';
  }
  public send(entry: Entry) {
    console.log(formatter(this.format, entry));
  }
}

export default Console;
