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
