import 'mocha';
import {expect} from 'chai';
import {Logger} from '../../src/Logger';
import TestTransport from '../fixtures/TestTransport';

describe('Logger', () => {
  let instance;
  let child;

  beforeEach(() => {
    instance = new Logger();
    child = instance.create('test');

  });

  describe('#constructor()', () => {
    it('should instantiate', () => {
      expect(instance).to.exist;
      expect(instance.name).to.equal('root');
    });
    it('should instantiate with `name`', () => {
      instance = new Logger('test');
      expect(instance).to.exist;
      expect(instance.name).to.equal('test');
    });

    it('should instantiate with `name` and `options.levels`', () => {
      instance = new Logger('test', {
        levels: {
          error: 0,
          info: 1,
          debug: 2
        }
      });
      expect(instance).to.exist;
      expect(instance.levels).to.have.keys([
        'error',
        'info',
        'debug'
      ]);
    });
  });

  describe('#levels', () => {
    it('should set levels and methods associated with each', () => {
      expect(instance.debug).to.exist;
      expect(instance.trace).to.exist;
      expect(instance.info).to.exist;
      expect(instance.warn).to.exist;
      expect(instance.error).to.exist;

      instance.levels = {
        info: 3,
        warn: 2,
        error: 1
      };

      expect(instance.debug).to.not.exist;
      expect(instance.trace).to.not.exist;
      expect(instance.info).to.exist;
      expect(instance.warn).to.exist;
      expect(instance.error).to.exist;

      expect(instance.levels).to.have.keys([
        'info',
        'warn',
        'error'
      ]);
    });
  });

  describe('#configure()', () => {
    it('should configure `transports`', () => {
      instance.configure({
        transports: [
          new TestTransport({
            level: 'info'
          })
        ]
      });
      expect(instance.transports.length).to.equal(1);
      expect(instance.children[0].transports.length).to.equal(1);
    });

    it('should configure `template`', () => {
      const template = '[{level}] [{date}] {message}';
      instance.configure({
        template: template
      });
      expect(instance.template).to.equal(template);
    })
  });

  describe('#create()', () => {
    it('should create a new child given `options`', () => {
      const anotherChild = instance.create('test2', {
        transports: [
          new TestTransport({
            level: 'error'
          })
        ],
        levels: {
          error: 0
        }
      });
      expect(instance.children.length).to.equal(2);
      expect(instance.get('test2')).to.equal(anotherChild);
      expect(instance.transports).to.not.equal(instance.find('test2').transports);
      expect(instance.find('test2').levels).to.have.keys([
        'error'
      ]);
    });
  });

  describe('#get()', () => {
    it('should return the pre-existing child', () => {
      expect(instance.get('test')).to.equal(instance.children[0]);
    });

    it('should return a new child', () => {
      expect(instance.get('test2')).to.equal(instance.children[1]);
    });
  });

  describe('#serialize()', () => {
    it('should serialize with specified `level` and `message`', () => {
      const entry = instance.serialize('debug', 'Test message');
      expect(entry).to.have.keys([
        'date',
        'level',
        'message',
        'name'
      ]);
    });
  });

  describe('#log()', () => {
    it('should emit the entry while specifying `message` and `data`', (done) => {
      let emitted = false;
      instance.once('info', (entry) => {
        expect(entry.data).to.exist;
        expect(entry.data.bool).to.equal(true);
        emitted = true;
      });
      instance.log('info', 'Test message', {bool: true});

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
        instance.log('info', {
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
        instance.log('invalid', 'This should not fire!');
        return done(new Error('Did not throw!'));
      } catch (error) {
        if (error.message === 'Invalid level: invalid') {
          return done();
        }
        return done(error);
      }
    });

    it('should execute transport on it\'s minimum log level while specifying `template` and no `message`', (done) => {
      let emitted = false;
      const transport = new TestTransport({level: 'info'});
      instance.template = '{string0} {string1} {string2}';
      instance.use(transport);
      transport.on('execute', (entry) => {
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

      instance.log('info', {
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

    it('should not execute transport below it\'s level while specifying `message`', (done) => {
      const transport = new TestTransport({level: 'info'});
      let emitted = false;
      instance.use(transport);
      transport.once('execute', () => {
        emitted = true;
      });
      instance.debug('Test message');

      setTimeout(() => {
        if (emitted) {
          return done(new Error('Did emit!'));
        } else {
          return done();
        }
      }, 10);
    });
  });

  describe('#register()', () => {
    it('should return false when logger is already registered', () => {
      expect(instance.register(instance.get('test'))).to.equal(false);
    });

    it('should throw if child exists with same name', (done) => {
      try {
        instance.register(new Logger('test'));
        return done(new Error('Did not throw!'));
      } catch (error) {
        if (error.message = 'Child already exists with name "test"') {
          return done();
        }
        return done(error);
      }
    })
  });

  describe('#use()', () => {
    let transport: TestTransport;
    before(() => {
      transport = new TestTransport({level: 'info'});
    });

    it('should add a new transport', () => {
      expect(instance.transports.length).to.equal(0);
      instance.use(transport);
      expect(instance.transports.length).to.equal(1);
    });

    it('should not re-add a pre-existing transport', () => {
      expect(instance.transports.length).to.equal(0);
      instance.use(transport);
      expect(instance.transports.length).to.equal(1);
      instance.use(transport);
      expect(instance.transports.length).to.equal(1);
    });

    it('should throw on invalid transport log level', (done) => {
      const transport = new TestTransport({level: 'invalid'});
      try {
        instance.use(transport);
        return done(new Error('Did not throw!'));
      } catch (error) {
        if (error.message === 'Transport specifies invalid `level`: invalid') {
          return done();
        }
        return done(error);
      }
    });
  });

  describe('#{level}()', () => {
    it('should execute a on corresponding log level', (done) => {
      const triggered = [];
      for (const level in instance.levels) {
        instance.once(level, (entry) => {
          expect(entry).to.exist;
          expect(entry.level).to.equal(level);

          if (triggered.indexOf(level) !== -1) {
            return done(new Error(level + ' triggered twice'));
          }

          triggered.push(level);

          for (const lvl in instance.levels) {
            if (triggered.indexOf(lvl) === -1) {
              return;
            }
          }
          return done();
        });

        instance[level]('test message');
      }
    });
  });
});