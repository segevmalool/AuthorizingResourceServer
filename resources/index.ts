import type { RequestHandler } from './requestHandler.types.js';
import { getRed } from './red.js';
import { getWhite } from './white.js';
import { getBlue } from './blue.js';
import type { RouterContext } from '@koa/router';
import type { Next } from 'koa';
import { getProvidedSecretsHeader, parseProvidedSecretsHeader } from '../request_utils/index.js';


export function listAuthorizations () {
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

export const handlers: RequestHandler[] = [
  {
    path: '/red',
    handler: getRed(),
    method: 'get',
    secret: 'BLOOOOOD',
  },
  {
    path: '/white',
    handler: getWhite(),
    method: 'get',
    secret: 'PURIFication',
  },
  {
    path: '/blue',
    handler: getBlue(),
    method: 'get',
    secret: 'calmwaters',
  },
  {
    path: '/authorizations',
    handler: listAuthorizations(),
    method: 'get',
    secret: undefined,
  },
];
