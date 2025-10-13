import type { Middleware, Context, Next } from 'koa';
import { handlers } from '../resources/index.js';
import { AuthorizationError, BadRequestError } from '../errors/index.js';
import type { RequestHandler } from '../resources/requestHandler.types.js';
import { getProvidedSecretsHeader, parseProvidedSecretsHeader } from '../request_utils/index.js';

// Throws an error if Authorization fails.
export async function checkAuthorization(ctx: Context, handler: RequestHandler) {
  // Indicates "public" endpoint.
  if (!handler.secret) {
    return;
  }

  const providedSecrets = parseProvidedSecretsHeader(getProvidedSecretsHeader(ctx));

  if (!handler.secret || !(providedSecrets.includes(handler.secret))) {
    throw new AuthorizationError('Access Denied');
  }
}

/** Throws an error if authorization fails.
 * 1. Match the requested path with defined resources. If not found, throw bad request.
 * 2. In any other case, if the request is authorized, then proceed.
 */
export function authorizeRequest(): Middleware {
  return async (ctx: Context, next: Next) => {
    const requestedPath = ctx.path;

    // Find handler for this path.
    const handler = handlers.find((handler) => {
      if (handler.path === requestedPath) {
        return handler;
      }
    });

    if (!handler) {
      throw new BadRequestError();
    }

    await checkAuthorization(ctx, handler);

    // Proceed with the request.
    await next();
  }
}
