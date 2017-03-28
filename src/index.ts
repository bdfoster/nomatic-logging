import 'source-map-support/register';
import {Logger, LoggerOptions} from './Logger';
import ConsoleTransport from './transports/ConsoleTransport';
export * from './Logger';

export const DEFAULT_TRANSPORT = new ConsoleTransport({
  level: 'debug'
});

export const instances: Logger[] = [];

export function create(options: LoggerOptions) {
  const logger = new Logger(options);
  register(logger);
  return logger;
}

export function find(namespace: string) {
  for (const i in instances) {
    if (instances[i].namespace === namespace) {
      return instances[i];
    }
  }
  return null;
}

export function get(namespace: string) {
  let result = find(namespace);

  if (result) {
    return result;
  }

  return create({
    namespace: namespace,
    transports: [
      DEFAULT_TRANSPORT
    ]
  });
}

export function register(logger: Logger) {
  if (!find(logger.namespace)) {
    instances.push(logger);
    return;
  }

  throw new Error('Logger already registered to namespace: ' + logger.namespace);
}

export default get;
