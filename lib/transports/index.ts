import Transport from '../Transport';
import Console from './Console';

const transports = {
  console: new Console()
}

export function register(name: string, transport: Transport) {
  if (transports.hasOwnProperty(name)) {
    throw new Error('Another transport is already registered as ' + name);
  }
  transports[name] = transport;
}

export function override(name: string, transport: Transport) {
  transports[name] = transport;
}

export function get(name) {
  return transports[name] || null;
}
