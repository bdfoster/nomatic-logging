import 'mocha';
import {expect} from 'chai';
import Console from '../../../src/transport/Console';

describe('Console', () => {
  let instance: Console;
  beforeEach(() => {
    instance = new Console({level: 'debug'});
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