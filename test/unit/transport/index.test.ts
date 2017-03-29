import 'mocha';
import {expect} from 'chai';
import {transport} from '../../../src';

describe('transport', () => {
  describe('create', () => {
    it('should create a new instance of Transport', () => {
      expect(transport.create({
        level: 'debug',
        handle(entry) {
          expect(entry).to.exist;
          return;
        }
      })).to.exist;
    });
  });
});