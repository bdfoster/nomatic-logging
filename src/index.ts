import Logger from './Logger';
import ConsoleTransport from './transports/ConsoleTransport';

export * from './Logger';
export * from './transports';
export * from './transports/ConsoleTransport';

export default new Logger('root', {
    transports: [
        new ConsoleTransport({
            level: 'info'
        })
    ]
});
