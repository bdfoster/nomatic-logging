import 'mocha';
import {expect} from 'chai';
import {create, register, find, get, Logger} from '../../src';

describe('create()', () => {
  it('should create a Logger with specified `namespace`', () => {
    expect(create('test1')).to.exist;
  });
});

describe('register()', () => {
  it('should register a pre-existing Logger instance', () => {
    const logger = new Logger('test2');
    register(logger);
  });

  it('should throw when namespace already is registered', (done) => {
    const logger = new Logger('test5');
    register(logger);

    try {
      register(logger);
      return done(new Error('Did not throw!'));
    } catch (error) {
      if (error.message === 'Logger already registered to namespace: test5') {
        return done();
      }

      return done(error);
    }
  });
});

describe('find()', () => {
  it('should return a Logger already registered to a namespace', () => {
    create('test6');
    expect(find('test6')).to.not.be.null;
  });

  it('should return null if no logger is registered in namespace', () => {
    expect(find('superloggerthing')).to.be.null;
  });
});

describe('get()', () => {
  it('should either find existing or create new logger', () => {
    const logger = create('test29340234');
    expect(logger).to.equal(get(logger.namespace));
  });
});
