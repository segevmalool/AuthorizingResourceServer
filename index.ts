import Koa from 'koa';
import Router from '@koa/router';
import { handlers } from './resources/index.js';
import { listAuthorizations } from './resources/index.js';
import { handleErrors } from './errors/index.js';
import { checkAuthorization } from './authorization/index.js';

const app = new Koa();

const resourcesRouter = new Router();
const authorizationRouter = new Router();

// Setup for resource handlers
for (const requestHandler of handlers) {
  switch (requestHandler.method) {
    case 'get':
      resourcesRouter.get(requestHandler.path, requestHandler.handler);
      break;
    default:
      console.log('unsupported method detected')
  }
}

authorizationRouter.get('/authorizations', listAuthorizations());

// General request handling
app.use(handleErrors());
app.use(checkAuthorization());

// Resource Routers
// No CORS options requests handled. https://github.com/koajs/router/blob/master/API.md#routerallowedmethodsoptions--function
app.use(authorizationRouter.routes());
app.use(resourcesRouter.routes());

app.listen(8080);
