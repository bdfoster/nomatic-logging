import {Transport, TransportOptions} from '../Transport'

export {default as console} from './console';

export function create(options: TransportOptions) {
  return new Transport(options);
}

export default create;