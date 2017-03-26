import Logger from './Logger';
export declare type MessageTemplate = string;
export interface Entry {
    namespace: string;
    message: string;
    createdAt: Date;
    hostname: string;
}
export interface Levels {
    [key: string]: number;
}
export interface Instances {
    [key: string]: Logger;
}
export declare const instances: Instances;
export declare function register(instance: Logger): void;
export declare function instance(namespace: string): Logger;
