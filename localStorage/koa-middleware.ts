import type {Context, Next} from 'koa';
import { PropagatedRequestData, RequestLocalStorage} from './index.js';

export function withRequestLocalStorage() {
  return async (_ctx: Context, next: Next) => {
    await RequestLocalStorage.run(new PropagatedRequestData(), next);
  };
}