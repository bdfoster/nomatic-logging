import 'mocha';
import {expect} from 'chai';
import TestTransport from './fixtures/TestTransport';

describe('Transport', () => {
  let instance: TestTransport;
  beforeEach(() => {
    instance = new TestTransport();
  });

  describe('#constructor()', () => {
    it('should create a new instance', () => {
      expect(instance).to.have.keys([
        'level',
        'listeners',
        '_maxListeners'
      ]);
    });
  });

  describe('#execute()', () => {
    it('should execute', (done) => {
      let emitted;
      instance.on('execute', () => {
        emitted = true;
      });
      instance.execute({
        name: 'test',
        date: new Date(),
        level: 'info',
        message: 'test'
      });

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });
  })
});