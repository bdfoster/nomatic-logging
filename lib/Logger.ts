import {EventEmitter} from 'events';
import {register} from './';

export class Logger extends EventEmitter {
  private _level: string;

  public readonly namespace: string;
  constructor(namespace: string) {
    super();
    this.namespace = namespace;
    register(this);
  }
}
export default Logger;
