import transport from '../../src';
import {LoggerEntry} from '../../src/index';

export class TestTransport extends transport.Transport {
  public execute(entry: LoggerEntry) {
    this.emit('execute', entry);
  }
}

export default TestTransport;
