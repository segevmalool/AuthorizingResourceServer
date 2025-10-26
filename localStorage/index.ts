import {AsyncLocalStorage} from 'node:async_hooks';

import {Client} from '../authentication/client.js';

export class PropagatedRequestData {
  private client: Client | null;

  constructor() {
    this.client = null;
  }

  public getClient(): Client | null { return this.client; }
  public setClient(client: Client) { this.client = client; }
}

export const RequestLocalStorage = new AsyncLocalStorage<PropagatedRequestData>();

