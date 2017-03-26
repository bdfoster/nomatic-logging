import Logger from './Logger'

export type MessageTemplate = string;

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
  trace: 5,
  debug: 40,
  info: 30,
  warn: 20,
  error: 10
};
