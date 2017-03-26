import Logger from './lib/Logger';
import {Instances} from './lib';
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
