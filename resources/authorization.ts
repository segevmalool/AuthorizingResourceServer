import { type RouterContext } from '@koa/router';
import type { Next } from 'koa';
import type { RequestHandler } from './requestHandler.types.js';
import { AuthorizationGrantStorageSingleton } from '../authorization/index.js';
import { RequestLocalStorage } from '../localStorage/index.js';
import { AuthorizingResourceServerError } from '../errors/index.js';

export function getAuthorizedEndpoints (handlers: RequestHandler[]) {
  return async (ctx: RouterContext, next: Next) => {
    const canDo: RequestHandler[] = [];

    const requestLocalStorage = RequestLocalStorage.getStore();

    if (!requestLocalStorage) {
      throw new AuthorizingResourceServerError();
    }

    const clientId = requestLocalStorage.getClient()?.getClientId();

    if (!clientId) {
      throw new AuthorizingResourceServerError();
    }

    for (const grant of await AuthorizationGrantStorageSingleton.getInstance().findAuthorizationGrantsWhere(clientId)) {
      const requestHandler = handlers.find((handler) => handler.path === grant.getResourcePath())

      if (!requestHandler) {
        // No request handler for resource with authz granted. (or authz granted for non existent resource)
        throw new AuthorizingResourceServerError();
      }

      canDo.push(requestHandler);
    }

    ctx.response.body = canDo.map(handler => handler.path);
    await next();
  }
}
