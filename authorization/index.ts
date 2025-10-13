import type { Middleware, Context, Next } from 'koa';
import { handlers } from '../resources/index.js';
import { AuthorizationError } from '../errors/index.js';
import { getProvidedSecretsHeader, parseProvidedSecretsHeader } from '../request_utils/index.js';

// Throws an error if authorization fails.
export function checkAuthorization(): Middleware {
  return async (ctx: Context, next: Next) => {
    // Find handler for this path.
    const handler = handlers.find((handler) => {
      if (handler.path === ctx.path) {
        return handler;
      }
    });

    if (!handler) {
      throw new AuthorizationError();
    }

    // "public" endpoint
    if (!handler.secret) {
      // Proceed with the request.
      await next();
      return;
    }

    const providedSecrets = parseProvidedSecretsHeader(getProvidedSecretsHeader(ctx));
    if (!(providedSecrets.includes(handler.secret))) {
      throw new AuthorizationError('Access Denied');
    }

    // Proceed with the request.
    await next();
  }
}
