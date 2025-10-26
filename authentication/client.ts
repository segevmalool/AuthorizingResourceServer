export class Client {
  public constructor(private clientId: string, private clientSecret: string) {
  }

  public authenticate(clientId: string, clientSecret: string): Client | null {
    const authenticated = this.clientId === clientId && this.clientSecret === clientSecret;

    if (!authenticated) {
      return null;
    }

    return this;
  }

  public getClientId() {
    return this.clientId;
  }
}