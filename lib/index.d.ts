import Logger from './Logger';
export declare type MessageTemplate = string;
export interface Entry {
    namespace: string;
    level: string;
    message: string;
    createdAt: Date;
    hostname: string;
    data?: Object;
}
export interface Levels {
    [key: string]: number;
}
export interface Instances {
    [key: string]: Logger;
}
export declare const levels: {
    trace: number;
    debug: number;
    info: number;
    warn: number;
    error: number;
};
