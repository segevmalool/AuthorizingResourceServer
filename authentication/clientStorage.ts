import {Client} from './client.js';

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