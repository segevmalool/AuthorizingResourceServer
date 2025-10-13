import type { Middleware } from '@koa/router';

export interface RequestHandler {
  path: string;
  handler: Middleware;
  method: 'get' | 'post';
  secret: string | undefined; // undefined means no authorization
}
