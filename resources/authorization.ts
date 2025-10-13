import { type RouterContext } from '@koa/router';
import type { Next } from 'koa';
import type { RequestHandler } from './requestHandler.types.js';

import { getProvidedSecretsHeader, parseProvidedSecretsHeader } from '../request_utils/index.js';

export function getAuthorizedEndpoints (handlers: RequestHandler[]) {
  return async (ctx: RouterContext, next: Next) => {
    const canDo: RequestHandler[] = [];
    let providedSecrets = parseProvidedSecretsHeader(getProvidedSecretsHeader(ctx));

    for (const providedSecret of providedSecrets) {
      const handler_p = handlers.find((handler => handler.secret === providedSecret));
      if (handler_p) {
        canDo.push(handler_p);
      }
    }

    ctx.response.body = canDo.map(handler => handler.path);
    await next();
  }
}
