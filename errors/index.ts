import type { Context, Middleware, Next } from 'koa';

export class AuthorizationError extends Error {
  public get responseCode(): number { return 401 };
  public get responseBody(): string { return 'Access Denied' };
}

export function handleErrors(): Middleware {
  return async (ctx: Context, next: Next)=> {
    try {
      await next();
    } catch (error: unknown) {
      if (error instanceof AuthorizationError) {
        ctx.status = error.responseCode;
        ctx.response.body = error.responseBody;
      }
    }
  };
}
