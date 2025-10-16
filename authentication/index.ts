import type { Context, Next } from 'koa';
import { AuthenticationError } from '../errors/index.js';

class Client {
  public constructor(private clientId: string, private clientSecret: string) {}

  public authenticate(clientId: string, clientSecret: string): Client | null {
    const authenticated = this.clientId === clientId && this.clientSecret === clientSecret;

    if (!authenticated) {
      return null;
    }

    return this;
  }
}

export class ClientStorage {
  private clients: Client[] = [];

  public constructor(clientList: Client[]) {
    this.clients = clientList;
  }

  public findClient(clientId: string, clientSecret: string): Client | null {
    return this.clients.find((client: Client) => client.authenticate(clientId, clientSecret)) ?? null;
  }
}

export class ClientStorageSingleton {
  private static instance: ClientStorage | null = null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ClientStorage([
        new Client('user', 'pass'),
      ]);
    }
    return this.instance;
  }
}

export function authenticateClient() {
  return async (ctx: Context, next: Next)=> {
    const authorizationHeader = ctx.headers.authorization;

    if (!authorizationHeader) {
      throw new AuthenticationError('Missing authorization header');
    }

    if (!authorizationHeader.startsWith('Basic')) {
      throw new AuthenticationError('Bad authorization header');
    }

    const userpass = authorizationHeader.split(' ')[1];

    if (!userpass) {
      throw new AuthenticationError('Missing userpass');
    }

    const [clientId, clientSecret] = Buffer.from(userpass, 'base64').toString('utf-8').split(':');

    if (!clientId || !clientSecret) {
      throw new AuthenticationError('Bad userpass');
    }

    const client: Client | null = ClientStorageSingleton.getInstance().findClient(clientId, clientSecret);

    if (!client) {
      throw new AuthenticationError('Invalid client');
    }

    await next();
  }
}
