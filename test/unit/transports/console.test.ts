import 'mocha';
import {expect} from 'chai';
import {create} from '../../../src/transport/console';

describe('console', () => {
  describe('#create()', () => {
    it('should create an instance of Transport', () => {
      expect(create({
        level: 'info'
      })).to.have.keys([
        '_level',
        '_handler'
      ]);
    });

    it('should create an instance of Transport with given `template`', () => {
      expect(create({level: 'info', template: '{message}'}).push({
        namespace: 'test',
        hostname: 'test',
        createdAt: new Date(),
        level: 'info',
        message: 'Test message via console'
      })).to.not.throw;
    })
  });
});