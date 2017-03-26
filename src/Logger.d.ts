/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Logger extends EventEmitter {
    private _level;
    readonly namespace: string;
    constructor(namespace: string);
}
export default Logger;
