"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const events_1 = require("events");
const _1 = require("../");
const _2 = require("./");
class Logger extends events_1.EventEmitter {
    constructor(namespace) {
        super();
        this.namespace = namespace;
        _1.register(this);
        for (const level in _2.levels) {
            this[level] = (message, data) => {
                this.send(level, message, data);
            };
        }
    }
    serialize(level, message, data = null) {
        const entry = {
            namespace: this.namespace,
            message: message,
            level: level,
            hostname: os.hostname(),
            createdAt: new Date()
        };
        if (data) {
            entry.data = data;
        }
        return entry;
    }
    send(level, message, string, data = null) {
        if (!_2.levels.hasOwnProperty(level)) {
            throw new Error('Invalid level: ' + level);
        }
        const entry = this.serialize(level, message, data);
        this.emit(level, entry);
    }
}
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=Logger.js.map