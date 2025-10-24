import type { Middleware, Context, Next } from 'koa';
import { RequestLocalStorage } from '../localStorage/index.js';
import {AuthorizationError, AuthorizingResourceServerError, BadRequestError} from '../errors/index.js';
import {handlers} from '../resources/index.js';

export class AuthorizationGrant {
  constructor(private clientId: string, private resourcePath: string) {}

  public checkAccess(clientId: string, resourcePath: string): AuthorizationGrant | null {
    const accessGranted = this.clientId === clientId && this.resourcePath === resourcePath;

    if (accessGranted) return this;

    return null;
  }

  public getClientId(): string { return this.clientId };
  public getResourcePath(): string { return this.resourcePath };
}

export class AuthorizationGrantStorage {
  public grantedAuthorizations: AuthorizationGrant[] = [];

  public constructor(grantedAuthorizations: AuthorizationGrant[]) {
    this.grantedAuthorizations = grantedAuthorizations;
  }

  public async findAuthorizationGrant(clientId: string,  resourcePath: string): Promise<AuthorizationGrant | null> {
    const result = this.grantedAuthorizations.find(
      (authz: AuthorizationGrant) => authz.checkAccess(clientId, resourcePath)
    );

    return result ?? null;
  }

  public async findAuthorizationGrantsWhere(clientId: string): Promise<AuthorizationGrant[]> {
    const result = this.grantedAuthorizations.filter(
      (authz: AuthorizationGrant) => authz.getClientId() === clientId,
    );

    return result;
  }
}

export class AuthorizationGrantStorageSingleton {
  private static instance: AuthorizationGrantStorage | null = null;

  public static getInstance(): AuthorizationGrantStorage {
    if (!this.instance) {
      this.instance = new AuthorizationGrantStorage([
        new AuthorizationGrant('user', '/red'),
        new AuthorizationGrant('user', '/blue'),
        new AuthorizationGrant('user', '/white'),
      ]);
    }

    return this.instance;
  }
}

/** Throws an error if authorization fails.
 * 1. Match the requested path with defined resources. If not found, throw bad request.
 * 2. In any other case, if the request is authorized, then proceed.
 */
export function authorizeRequest(): Middleware {
  return async (ctx: Context, next: Next) => {
    const requestLocalStorage = RequestLocalStorage.getStore();

    if (!requestLocalStorage) {
      throw new AuthorizingResourceServerError();
    }

    const clientId = requestLocalStorage.getClient()?.getClientId()

    if (!clientId) {
      throw new AuthorizingResourceServerError();
    }

    const requestedResourcePath = ctx.path;

    if (!requestedResourcePath) {
      throw new BadRequestError();
    }

    const requestHandler = handlers.find(handler => handler.path === requestedResourcePath);

    if (!requestHandler) {
      throw new BadRequestError();
    }

    const isPublicEndpoint = requestHandler.isPublic;

    // Check for authorization grant
    const grant = await AuthorizationGrantStorageSingleton.getInstance()
    .findAuthorizationGrant(clientId, requestedResourcePath);

    if (!isPublicEndpoint && !grant) {
      throw new AuthorizationError();
    }

    // Proceed with the request.
    await next();
  }
}
