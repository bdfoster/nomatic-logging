import Transport from '../Transport';
import {Entry} from '../Logger';
import * as format from 'string-format';

export interface ConsoleTransportOptions {
  level: string;
  template?: string;
}

export function create(options: ConsoleTransportOptions) {
  if (!options.template) {
    options.template = '[{level}] {message}';
  }
  return new Transport({
    level: options.level,
    handler(entry: Entry) {
      console.log(format(options.template, entry));
    }
  });
}

export default create;