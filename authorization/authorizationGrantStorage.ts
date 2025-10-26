import {AuthorizationGrant} from './authorizationGrant.js';

export class AuthorizationGrantStorage {
  public grantedAuthorizations: AuthorizationGrant[] = [];

  public constructor(grantedAuthorizations: AuthorizationGrant[]) {
    this.grantedAuthorizations = grantedAuthorizations;
  }

  public async findAuthorizationGrant(clientId: string, resourcePath: string): Promise<AuthorizationGrant | null> {
    const result = this.grantedAuthorizations.find(
      (authz: AuthorizationGrant) => authz.checkAccess(clientId, resourcePath),
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