import type {Context, Middleware, Next} from 'koa';
import {RequestLocalStorage} from '../localStorage/index.js';
import {AuthorizationError, AuthorizingResourceServerError, BadRequestError} from '../errors/index.js';
import {handlers} from '../resources/index.js';
import {AuthorizationGrantStorageSingleton} from './authorizationGrantStorage.js';

/** Throws an error if authorization fails.
 * 1. Match the requested path with defined resources. If not found, throw bad request.
 * 2. In any other case, if the request is authorized, then proceed.
 */
export function authorizeRequest(): Middleware {
  return async (ctx: Context, next: Next) => {
    const requestLocalStorage = RequestLocalStorage.getStore();

    if (!requestLocalStorage) {
      throw new AuthorizingResourceServerError();
    }

    const clientId = requestLocalStorage.getClient()?.getClientId()

    if (!clientId) {
      throw new AuthorizingResourceServerError();
    }

    const requestedResourcePath = ctx.path;

    if (!requestedResourcePath) {
      throw new BadRequestError();
    }

    const requestHandler = handlers.find(handler => handler.path === requestedResourcePath);

    if (!requestHandler) {
      throw new BadRequestError();
    }

    const isPublicEndpoint = requestHandler.isPublic;

    // Check for authorization grant
    const grant = await AuthorizationGrantStorageSingleton.getInstance()
    .findAuthorizationGrant(clientId, requestedResourcePath);

    if (!isPublicEndpoint && !grant) {
      throw new AuthorizationError();
    }

    // Proceed with the request.
    await next();
  }
}
