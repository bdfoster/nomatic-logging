import Transport from '../Transport';
import Runtime from './Runtime';
import Console from './Console';

const transports = {
  console: new Console()
}

export function register(name: string, transport: Transport) {
  if (transports.hasOwnProperty(name)) {
    throw new Error('Another transport is already registered as ' + name);
  }
  override(name, transport);
}

export function override(name: string, transport: Transport | Function) {
  if (typeof transport === 'function') {
    transports[name] = new Runtime({
      handler: transport
    });
  } else if (!transport.send || typeof transport.send !== 'function') {
    throw new Error('Transport instance must have `send` function');
  } else {
    return transports[name] = transport;
  }
}

export function get(name) {
  return transports[name] || null;
}
