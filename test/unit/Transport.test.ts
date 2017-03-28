import 'mocha';
import {expect} from 'chai';
import {Transport} from '../../src/Transport';
import TestTransport from '../fixtures/TestTransport';
describe('Transport', () => {
  let instance;
  beforeEach(() => {
    instance = new TestTransport({level: 'info'});
  });

  describe('#constructor()', () => {
    it('should create a new instance', () => {
      expect(instance).to.have.keys([
        '_level',
        'emitter'
      ]);
    });
  });

  describe('#push()', () => {
    it('should call #send() on the default level', (done) => {
      let emitted = false;
      instance.emitter.once('info', () => {
        emitted = true;
      });

      instance.push({
        namespace: 'test',
        message: 'Test message',
        hostname: 'test',
        createdAt: new Date(),
        level: instance.level
      });

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    it('should not call #send() on a higher level', (done) => {
      let emitted = false;
      instance.emitter.once('debug', () => {
        emitted = true;
      });

      instance.push({
        namespace: 'test',
        message: 'Test message',
        hostname: 'test',
        createdAt: new Date(),
        level: 'debug'
      });

      setTimeout(() => {
        if (!emitted) {
          return done();
        } else {
          return done(new Error('Did emit!'));
        }
      }, 10);
    });

    it('should call #send() on a lower level', (done) => {
      let emitted = false;
      instance.emitter.once('error', () => {
        emitted = true;
      });

      instance.push({
        namespace: 'test',
        message: 'Test message',
        hostname: 'test',
        createdAt: new Date(),
        level: 'error'
      });

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    describe('#level', () => {
      it('should set given a valid level', () => {
        expect(instance.level = 'debug').to.not.throw;
      });

      it('should throw given an invalid level', (done) => {
        try {
          instance.level = 'invalid';
          return done('Did not throw!');
        } catch(error) {
          if (error.message === 'Invalid level: invalid') {
            return done();
          }
          return done(error);
        }
      })
    })
  });
});