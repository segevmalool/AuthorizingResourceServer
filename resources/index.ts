import type { RequestHandler } from './requestHandler.types.js';
import { getRed } from './red.js';
import { getWhite } from './white.js';
import { getBlue } from './blue.js';
import { getAuthorizedEndpoints } from './authorization.js';
import Router from '@koa/router';

export const handlers: RequestHandler[] = [
  {
    path: '/red',
    handler: getRed(),
    method: 'get',
    secret: 'BLOOOOOD',
  },
  {
    path: '/white',
    handler: getWhite(),
    method: 'get',
    secret: 'PURIFication',
  },
  {
    path: '/blue',
    handler: getBlue(),
    method: 'get',
    secret: 'calmwaters',
  },
];

// The authoriation endpoint is public, so out of scope for
handlers.push(
  {
    path: '/authorizations',
    handler: getAuthorizedEndpoints(handlers),
    method: 'get',
    secret: undefined,
  },
)

export const resourcesRouter = new Router();

// Setup for resource handlers.
/**
 * By the time the resources get hit, the request has been authorized.
 * See {@link checkAuthorization} for authorization decisioning.
 * Also see  {@link setupApp} to see integration into the koa handler hierarchy.
 */
for (const requestHandler of handlers) {
  switch (requestHandler.method) {
    case 'get':
      resourcesRouter.get(requestHandler.path, requestHandler.handler);
      break;
    default:
      console.log('unsupported method detected')
  }
}
