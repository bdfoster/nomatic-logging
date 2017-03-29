import 'mocha';
import {expect} from 'chai';
import Transport from '../../src/Transport';
import {EventEmitter} from 'nomatic-events';
import {Logger} from '../../src/Logger';

describe('Transport', () => {
  let emitter: EventEmitter;
  let instance: Transport;
  let logger: Logger;
  beforeEach(() => {
    emitter = new EventEmitter();
    instance = new Transport({
      level: 'info',
      handler(entry) {
        emitter.emit('entry', entry);
      }
    });
    logger = new Logger({
      namespace: 'test'
    });
  });

  describe('#constructor()', () => {
    it('should create a new instance', () => {
      expect(instance).to.have.keys([
        'level',
        '_handler'
      ]);
    });
  });

  describe('#push()', () => {
    it('should call #send() on the default level', (done) => {
      let emitted = false;
      emitter.once('entry', () => {
        emitted = true;
      });

      instance.push({
        namespace: 'test',
        message: 'Test message',
        hostname: 'test',
        createdAt: new Date(),
        level: instance.level
      }, logger);

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    it('should call #send() on a higher level', (done) => {
      let emitted = false;
      emitter.once('debug', () => {
        emitted = true;
      });

      instance.push({
        namespace: 'test',
        message: 'Test message',
        hostname: 'test',
        createdAt: new Date(),
        level: 'debug'
      }, logger);

      setTimeout(() => {
        if (!emitted) {
          return done();
        } else {
          return done(new Error('Did emit!'));
        }
      }, 10);
    });

    it('should not call #send() on a lower level', (done) => {
      let emitted = false;
      emitter.once('entry', () => {
        emitted = true;
      });

      instance.push({
        namespace: 'test',
        message: 'Test message',
        hostname: 'test',
        createdAt: new Date(),
        level: 'error'
      }, logger);

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    it('should throw on an invalid log level', (done) => {
      try {
        instance.push({
          namespace: 'test',
          message: 'Test message',
          hostname: 'test',
          createdAt: new Date(),
          level: 'invalid'
        }, logger);
        return done(new Error('Did not throw!'));
      } catch (error) {
        if (error.message === 'Invalid level: invalid') {
          return done();
        }
        return done(error);
      }

    })
  });

  describe('#level', () => {
    it('should set given a valid level', () => {
      expect(instance.level = 'debug').to.not.throw;
    });
  });
});