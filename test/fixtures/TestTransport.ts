import Transport from '../../src/Transport';
import {Entry} from '../../src/index';

export class TestTransport extends Transport {
  public execute(entry: Entry) {
    this.emit('execute', entry);
  }
}

export default TestTransport;