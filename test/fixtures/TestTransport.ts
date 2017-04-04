import {Transport} from '../../src/transport';
import {LoggerEntry} from '../../src/index';

export class TestTransport extends Transport {
  public execute(entry: LoggerEntry) {
    this.emit('execute', entry);
  }
}

export default TestTransport;