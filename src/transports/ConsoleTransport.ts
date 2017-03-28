import Transport from '../Transport';
import {TransportOptions} from '../Transport';
import {Entry} from '../Logger';
import * as format from 'string-format';

export interface ConsoleTransportOptions extends TransportOptions {
  template?: string;
}

export class ConsoleTransport extends Transport {
  public template: string = '[{namespace}]\t{level}: {message}';

  public constructor(options: ConsoleTransportOptions) {
    super(options);
    if (options.template) {
      this.template = options.template;
    }
  }

  public send(entry: Entry): void {
    console.log(format(this.template, entry));
  }
}

export default ConsoleTransport;
