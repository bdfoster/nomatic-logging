import 'source-map-support/register';
import Logger from './Logger';
export * from './Transport';
export * from './Logger';

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

export const levels: Levels = {
  trace: 50,
  debug: 40,
  info: 30,
  warn: 20,
  error: 10
};

export const instances: Logger[] = [];

export function create(namespace: string) {
  const logger = new Logger(namespace);
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

  return create(namespace);
}

export function register(logger: Logger) {
  if (!find(logger.namespace)) {
    instances.push(logger);
    return;
  }

  throw new Error('Logger already registered to namespace: ' + logger.namespace);

}

export default get;