import {Entry} from './';

export abstract class Transport {
  constructor(options: Object = {}) {
    this.init(options);
  }

  public abstract init(options: Object);

  public abstract send(entry: Entry);

  public open() {
    return;
  };
  public close() {
    return;
  };
}
export default Transport;
