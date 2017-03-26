"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const _1 = require("./");
class Logger extends events_1.EventEmitter {
    constructor(namespace) {
        super();
        this.namespace = namespace;
        _1.register(this);
    }
}
exports.Logger = Logger;
exports.default = Logger;
//# sourceMappingURL=Logger.js.map