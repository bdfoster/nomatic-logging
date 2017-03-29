import 'mocha';
import {expect} from 'chai';
import {create} from '../../../src/transport/console';
import Logger from '../../../src/Logger';

describe('transport.console', () => {
  let logger: Logger;
  beforeEach(() => {
    logger = new Logger({
      namespace: 'test',
      levels: {
        silly: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1
      }
    });
  });
  describe('#create()', () => {
    it('should create a console transport', () => {
      expect(create({
        level: 'info'
      })).to.have.keys([
        'level',
        '_handler'
      ]);
    });

    it('should create a console transport with given `template`', () => {
      expect(create({level: 'info', template: '{message}'}).push({
        hostname: 'test',
        createdAt: new Date(),
        level: 'info',
        message: 'Test message via console'
      }, logger)).to.not.throw;
    })
  });
});