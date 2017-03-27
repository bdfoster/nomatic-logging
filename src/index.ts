import Logger from './Logger'

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

export const levels = {
  trace: 50,
  debug: 40,
  info: 30,
  warn: 20,
  error: 10
};

export const instances: Instances = {};

export function create(namespace: string) {
  register(new Logger(namespace));
  return instances[namespace];
}

export function register(instance: Logger) {
  if (instances.hasOwnProperty(instance.namespace)) {
    throw new Error('Another Logger instance is already registered under namespace "'
      + instance.namespace + '"');
  }

  instances[instance.namespace] = instance;
}

export function instance(namespace: string) {
  if (instances.hasOwnProperty(namespace)) {
    return instances[namespace];
  }

  throw new Error('Namespace "' + namespace + '" is not registered');
}
