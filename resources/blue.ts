import type { Middleware, RouterContext } from '@koa/router';
import type { Next } from 'koa';

export function getBlue(): Middleware {
  return async (ctx: RouterContext, next: Next) => {
    ctx.response.body = 'here\'s your blue: BLUEEEEE';
    await next()
  };
}
