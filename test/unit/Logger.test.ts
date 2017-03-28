import 'mocha';
import {expect} from 'chai';
import {Logger} from '../../src/';
import {levels} from '../../src';
import {Transport} from '../../src';
import {EventEmitter} from 'nomatic-events';

describe('Logger', () => {
  let instance;

  beforeEach(() => {
    instance = new Logger({namespace: 'test'});
  });

  describe('#constructor()', () => {
    it('should initialize a new instance with specified `namespace`', () => {
      expect(instance).to.exist;
      expect(instance.namespace).to.equal('test');
    });

    it('should create a new instance with specified `namespace` and `template`', () => {
      instance = new Logger({
        namespace: 'test',
        template: '{string[0]} {string[1]} {string[2]}',
      });

      expect(instance.template).to.exist;
    });
  });

  describe('#serialize()', () => {
    it('should serialize with specified `level` and `message`', () => {
      const entry = instance.serialize('debug', 'Test message');
      expect(entry).to.have.keys([
        'namespace',
        'message',
        'hostname',
        'createdAt',
        'level'
      ]);
    });
  });

  describe('#send()', () => {
    it('should emit the entry while specifying `message`', (done) => {
      let emitted = false;

      instance.once('info', (entry) => {
        expect(entry).to.have.keys([
          'namespace',
          'message',
          'hostname',
          'createdAt',
          'level'
        ]);
        emitted = true;
      });
      instance.send('info', 'Test message');

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    it('should emit the entry while specifying `message` and `data`', (done) => {
      let emitted = false;
      instance.once('info', (entry) => {
        expect(entry).to.have.keys([
          'namespace',
          'message',
          'hostname',
          'createdAt',
          'level',
          'data'
        ]);
        expect(entry.data).to.have.keys([
          'bool'
        ]);
        expect(entry.data.bool).to.equal(true);
        emitted = true;
      });
      instance.send('info', 'Test message', { bool: true });

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    it('should emit the entry while specifying `data` using instance `template` to generate `message`', (done) => {
      let emitted = false;
      instance.template = '{string0} {string1} {string2}';
      instance.once('info', (entry) => {
        expect(entry).to.have.keys([
          'namespace',
          'message',
          'hostname',
          'createdAt',
          'level',
          'data'
        ]);
        expect(entry.data).to.have.keys([
          'string0',
          'string1',
          'string2',
          'bool'
        ]);
        expect(entry.message).to.equal('Test message using template');
        expect(entry.data.bool).to.equal(true);
        emitted = true;
      });
      instance.send('info', {
        bool: true,
        string0: 'Test',
        string1: 'message',
        string2: 'using template'
      });

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });

    it('should throw if no `template`', (done) => {
      try {
        instance.send('info', {
          string0: 'Test'
        });
        return done(new Error('Did not throw!'));
      } catch (error) {
        if (error.message === '`message` is not specified and `template` is not defined') {
          return done();
        }
        return done(error);
      }
    });

    it('should throw on an invalid `level`', (done) => {
      try {
        instance.send('invalid', 'This should not fire!');
        return done(new Error('Did not throw'));
      } catch(error) {
        if (error.message === 'Invalid level: invalid') {
          return done();
        }
        return done(error);
      }
    });
  });

  describe('#subscribe()', () => {
    let emitter: EventEmitter;
    let transport: Transport;
    beforeEach(() => {
      emitter = new EventEmitter();
      transport = new Transport({
        level: 'info',
        handler(entry) {
          emitter.emit(entry.level, entry);
        }
      });
    });


    it('should subscribe a Transport instance to the Logger instance', (done) => {
      let emitted = false;
      instance.subscribe(transport);

      emitter.on('info', () => {
        emitted = true;
      });

      instance.send('info', 'Test message');

      setTimeout(() => {
        if (!emitted) {
          return done(new Error('Did not emit!'));
        } else {
          return done();
        }
      }, 10);
    });



    it('should throw when attempting to subscribe an already subscribed transport', (done) => {
      instance.subscribe(transport);
      try {
        instance.subscribe(transport);
        return done(new Error('Did not throw!'));
      } catch(error) {
        if (error.message.startsWith('Transport already subscribed to')) {
          return done();
        }
        return done(error);
      }
    });
  });

  describe("#{level}()", () => {
    it('should call #send() when specifying `message`', (done) => {
      const triggeredLevels = [];
      instance.template = '{string0} {string1}';
      instance.level = 'debug';
      for (const level of Object.keys(levels)) {
        instance.on(level, (entry) => {
          triggeredLevels.push(level);
          expect(entry.message).to.equal('Test message');

          for (const lvl of Object.keys(levels)) {
            if (triggeredLevels.indexOf(lvl) === -1) {
              return;
            }
          }

          done();
        });
        instance[level]('Test message');
      }
    });
  });
});
