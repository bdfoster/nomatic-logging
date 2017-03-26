import Transport from '../Transport';
import {Entry} from '../';

export interface RuntimeOptions {
  handler: Function;
  [key: string]: any;
}

export class Runtime extends Transport {
  private options: RuntimeOptions;
  public init(options) {
    if (!options.handler || typeof options.handler !== 'function') {
      throw new Error('Runtime transport must have a function specified in `options`');
    }

    this.options = options;
  }

  public send(entry: Entry) {
    this.options.handler(entry);
  }
}

export default Runtime;
