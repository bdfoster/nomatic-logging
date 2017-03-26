"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const Logger_1 = require("../../../lib/Logger");
const lib_1 = require("../../../lib");
describe('Logger', () => {
    let instance;
    beforeEach(() => {
        instance = new Logger_1.default('test');
    });
    describe('#constructor()', () => {
        it('should initialize a new instance with specified `namespace`', () => {
            chai_1.expect(instance).to.exist;
            chai_1.expect(instance.namespace).to.equal('test');
        });
    });
    describe('#serialize()', () => {
        it('should serialize with specified `level` and `message`', () => {
            const entry = instance.serialize('debug', 'Test message');
            chai_1.expect(entry).to.have.keys([
                'name',
                'message',
                'hostname',
                'createdAt',
                'level'
            ]);
        });
    });
    describe('#send()', () => {
        it('should emit the entry', (done) => {
            let emitted = false;
            instance.once('info', (entry) => {
                chai_1.expect(entry).to.have.keys([
                    'name',
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
                }
                else {
                    return done();
                }
            }, 10);
        });
        it('should throw on an invalid `level`', (done) => {
            try {
                instance.send('invalid', 'This should not fire!');
                return done(new Error('Did not throw'));
            }
            catch (error) {
                if (error.message === 'Invalid log level: invalid') {
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
            for (const level of Object.keys(lib_1.levels)) {
                instance.once(level, () => {
                    triggeredLevels.push(level);
                    for (const lvl of Object.keys(lib_1.levels)) {
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
//# sourceMappingURL=Logger.test.js.map