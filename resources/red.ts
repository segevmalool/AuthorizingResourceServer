import type { Middleware, RouterContext } from '@koa/router';
import type { Next } from 'koa';

export function getRed(): Middleware {
  return async (ctx: RouterContext, next: Next) => {

    ctx.response.body = 'here\'s your RED: STOP';
    await next()
  };
}
