import 'mocha';
import {expect} from 'chai';
import ConsoleTransport from '../../../src/transports/ConsoleTransport';

describe('ConsoleTransport', () => {
  let instance: ConsoleTransport;
  beforeEach(() => {
    instance = new ConsoleTransport({level: 'debug'});
  });
  describe('#constructor()', () => {
    it('should create a new instance', () => {
      expect(instance).to.have.keys([
        '_level',
        'template'
      ]);
    });

    describe('#send()', () => {
      instance = new ConsoleTransport({
        level: 'debug',
        template: '[{level}]:/t {message}'
      });

      it('should parse `entry` and output to the console', () => {
        expect(instance.send({
          namespace: 'test',
          createdAt: new Date(),
          message: 'Test message to console via ConsoleTransport',
          hostname: 'test',
          data: {
            isTest: true
          },
          level: 'info'
        })).to.not.throw;
      });
    });
  });
});