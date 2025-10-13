import type { Context, Middleware, Next } from 'koa';

class AuthorizingResourceServerError extends Error {
  public get responseCode(): number { return 500 };
  public get responseBody(): string { return 'Unknown Error' };
}

export class AuthorizationError extends AuthorizingResourceServerError {
  public get responseCode(): number { return 401 };
  public get responseBody(): string { return 'Access Denied' };
}

export class BadRequestError extends AuthorizingResourceServerError {
  public get responseCode(): number { return 400 };
  public get responseBody(): string { return 'Bad Request' };
}

export function handleErrors(): Middleware {
  return async (ctx: Context, next: Next)=> {
    try {
      await next();
    } catch (error: unknown) {
      if (error instanceof AuthorizingResourceServerError) {
        ctx.status = error.responseCode;
        ctx.response.body = error.responseBody;
      }
    }
  };
}
