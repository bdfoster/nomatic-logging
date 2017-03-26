"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instances = {};
function register(instance) {
    if (exports.instances.hasOwnProperty(instance.namespace)) {
        throw new Error('Another Logger instance is already registered under namespace '
            + instance.namespace);
    }
    exports.instances[instance.namespace] = instance;
}
exports.register = register;
function instance(namespace) {
    if (exports.instances.hasOwnProperty(namespace)) {
        return exports.instances[namespace];
    }
    throw new Error('Namespace "' + namespace + '" is not registered');
}
exports.instance = instance;
//# sourceMappingURL=index.js.map
