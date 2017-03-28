import {Entry} from '../../src';
import {EventEmitter} from 'nomatic-events';
import {Transport, TransportOptions} from '../../src/Transport';

export class TestTransport extends Transport {
  public emitter: EventEmitter = new EventEmitter();
  constructor(options: TransportOptions) {
    super(options);

  }

  public send(entry: Entry) {
    this.emitter.emit(entry.level, entry);
  }
}

export default TestTransport;