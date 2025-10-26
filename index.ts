import Koa from 'koa';
import {resourcesRouter} from './resources/index.js';
import {withErrorHandling} from './errors/index.js';
import {withRequestAuthorization} from './authorization/kota-middleware.js';
import {withClientAuthentication} from './authentication/koa-middleware.js';

import {withRequestLocalStorage} from './localStorage/koa-middleware.js';

function setupApp(): Koa {
  const app = new Koa();

  // General request handling
  app.use(withErrorHandling());
  app.use(withRequestLocalStorage());
  app.use(withClientAuthentication());
  app.use(withRequestAuthorization());

  // Resource Routers
  // No CORS options requests handled. https://github.com/koajs/router/blob/master/API.md#routerallowedmethodsoptions--function
  app.use(resourcesRouter.routes());

  return app;
}

const app = setupApp();

app.listen(8080);
