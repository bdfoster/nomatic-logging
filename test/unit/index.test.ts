import 'mocha';
import {expect} from 'chai';
import Logger from '../../src/Logger';
import {create, register, instance} from '../../src';

describe('create()', () => {
  it('should create a Logger with specified `namespace`', () => {
    expect(create('test1')).to.exist;
  });
});

describe('register', () => {
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
      if (error.message === 'Another Logger instance is already registered under namespace "test5"') {
        return done();
      }

      return done(error);
    }
  });
});

describe('instance', () => {
  it('should get a pre-existing Logger instance', () => {
    create('test3');
    expect(instance('test3').namespace).to.equal('test3');
  });

  it('should throw on an un-registered namespace', (done) => {
    try {
      instance('test4');
      return done(new Error('Did not throw!'));
    } catch(error) {
      if (error.message === 'Namespace "test4" is not registered') {
        return done();
      }
      return done(error);
    }
  });
});
