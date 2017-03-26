import { Entry } from './';
export declare abstract class Transport {
    constructor(options: Object);
    abstract init(options: Object): any;
    abstract send(entry: Entry): any;
    open(): void;
    close(): void;
}
export default Transport;
