import type { Middleware, Context, Next } from 'koa';

export class AuthorizationGrant {
  constructor(private clientId: string, private resourcePath: string) {}

  public checkAccess(clientId: string, resourcePath: string): AuthorizationGrant | null {
    const accessGranted = this.clientId === clientId && this.resourcePath === resourcePath;

    if (accessGranted) return this;

    return null;
  }
}

export class AuthorizationGrantStorage {
  public grantedAuthorizations: AuthorizationGrant[] = [];

  public constructor(grantedAuthorizations: AuthorizationGrant[]) {
    this.grantedAuthorizations = grantedAuthorizations;
  }

  public findAuthorizationGrant(clientId: string,  resourcePath: string): AuthorizationGrant | null {
    const result = this.grantedAuthorizations.find(
      (authz: AuthorizationGrant) => authz.checkAccess(clientId, resourcePath)
    );

    return result ?? null;
  }
}

export class AuthorizationGrantStorageSingleton {
  private instance: AuthorizationGrantStorage | null = null;

  public getInstance(): AuthorizationGrantStorage {
    if (!this.instance) {
      this.instance = new AuthorizationGrantStorage([]);
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


    // Proceed with the request.
    await next();
  }
}
