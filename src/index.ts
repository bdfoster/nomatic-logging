import 'source-map-support/register';
import Logger from './Logger';
export * from './Logger';
export * from './Transport';

export const transport = require('./transport');

export interface Entry {
  name: string;
  level: string;
  message: string;
  date: Date;
  data?: Object;
}

export default new Logger(null, {
  transports: [
    new transport.Console({
      level: 'info'
    })
  ]
});