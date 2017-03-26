/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Logger extends EventEmitter {
    private _level;
    readonly namespace: string;
    constructor(namespace: string);
    private serialize(level, message, data?);
    send(level: string, message: any, string: any, data?: Object): void;
}
export default Logger;
