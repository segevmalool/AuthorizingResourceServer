import type { Middleware, RouterContext } from '@koa/router';
import type { Next } from 'koa';

export function getWhite(): Middleware {
  return async (ctx: RouterContext, next: Next) => {
    ctx.response.body = 'here\'s your white: go with purity';
    await next()
  };
}
