import 'mocha';
import {expect} from 'chai';
import Logger from '../../../lib/Logger';
import {levels} from '../../../lib';

describe('Logger', () => {
  let instance;

  beforeEach(() => {
    instance = new Logger('test');
  });

  describe('#constructor()', () => {
    it('should initialize a new instance with specified `namespace`', () => {
      expect(instance).to.exist;
      expect(instance.namespace).to.equal('test');
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
    it('should emit the entry without specifying `data`', (done) => {
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

    it('should emit the entry while specifying `data`', (done) => {
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
  describe("#[level]()", () => {
    it('should have generated instance methods corresponding to levels available', (done) => {
      const triggeredLevels = [];
      instance.level = 'debug';
      for (const level of Object.keys(levels)) {
        instance.once(level, () => {
          triggeredLevels.push(level);

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
