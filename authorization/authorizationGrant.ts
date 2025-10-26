export class AuthorizationGrant {
  constructor(private clientId: string, private resourcePath: string) {
  }

  public checkAccess(clientId: string, resourcePath: string): AuthorizationGrant | null {
    const accessGranted = this.clientId === clientId && this.resourcePath === resourcePath;

    if (accessGranted) return this;

    return null;
  }

  public getClientId(): string {
    return this.clientId
  };

  public getResourcePath(): string {
    return this.resourcePath
  };
}