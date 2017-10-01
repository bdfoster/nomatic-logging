import 'mocha';
import {expect} from 'chai';
import {ConsoleTransport} from '../../src';

describe('ConsoleTransport', () => {
  let instance: ConsoleTransport;
  beforeEach(() => {
    instance = new ConsoleTransport({level: 'debug'});
  });

  describe('#constructor()', () => {
    it('should instantiate', () => {
      expect(instance).to.exist;
    });
  });

  describe('#execute()', () => {
    it('should output to console', () => {
      instance.template = '[{date}] {level}\t {message}';
      instance.execute({
        name: 'test',
        date: new Date(),
        level: 'info',
        message: 'Test message to console'
      });
    });
  });
});