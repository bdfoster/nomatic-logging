import Logger from './lib/Logger';
import { Instances } from './lib';
export declare const instances: Instances;
export declare function register(instance: Logger): void;
export declare function instance(namespace: string): any;
