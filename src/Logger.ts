
import * as os from 'os';
import {EventEmitter} from 'nomatic-events';
import {Entry, levels} from './';

export class Logger extends EventEmitter {
  private _level: string;

  public readonly namespace: string;

  constructor(namespace: string) {
    super();
    this.namespace = namespace;

    for (const level in levels) {
      this[level] = (message: string, data: Object) => {
        this.send(level, message, data);
      }
    }
  }

  private serialize(level: string, message: string, data: Object = null) {
    const entry: Entry = {
      namespace: this.namespace,
      message: message,
      level: level,
      hostname: os.hostname(),
      createdAt: new Date()
    };

    if (data) {
      entry.data = data;
    }

    return entry;
  }

  public send(level: string, message: string, data: Object = null) {
    if (!levels.hasOwnProperty(level)) {
      throw new Error('Invalid level: ' + level);
    }

    const entry = this.serialize(level, message, data);
    this.emit(level, entry);
  }
}

export default Logger;
