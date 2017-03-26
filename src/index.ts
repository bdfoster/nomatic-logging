import Logger from './Logger';

export type MessageTemplate = string;

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

export const instances: Instances = {};

export function register(instance: Logger) {
  if (instances.hasOwnProperty(instance.namespace)) {
    throw new Error('Another Logger instance is already registered under namespace '
      + instance.namespace);
  }

  instances[instance.namespace] = instance;
}

export function instance(namespace: string) {
  if (instances.hasOwnProperty(namespace)) {
    return instances[namespace];
  }

  throw new Error('Namespace "' + namespace + '" is not registered');
}
