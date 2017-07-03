import {Transport} from '../../src';
import {LoggerEntry} from '../../src';

export default class TestTransport extends Transport {
  public execute(entry: LoggerEntry) {
    this.emit('execute', entry);
  }
}
