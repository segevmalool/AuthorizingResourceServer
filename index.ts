import Koa from 'koa';
import { resourcesRouter } from './resources/index.js';
import { handleErrors } from './errors/index.js';
import { authorizeRequest } from './authorization/index.js';
import { authenticateClient } from './authentication/index.js';

function setupApp() {
  const app = new Koa();

// General request handling
  app.use(handleErrors());
  app.use(authenticateClient());
  app.use(authorizeRequest());

// Resource Routers
// No CORS options requests handled. https://github.com/koajs/router/blob/master/API.md#routerallowedmethodsoptions--function
  app.use(resourcesRouter.routes());

  return app;
}

const app = setupApp();

app.listen(8080);
