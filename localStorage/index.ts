import { AsyncLocalStorage } from 'node:async_hooks';
import type { Client } from '../authentication/index.js';
import type { Context, Next } from 'koa';

class PropagatedRequestData {
  public get client() { return this.client }
  public set client(client: Client) { this.client = client }
}

export const RequestLocalStorage = new AsyncLocalStorage<PropagatedRequestData>();

export function withRequestLocalStorage() {
  return async (_ctx: Context, next: Next)=> {
    await RequestLocalStorage.run(new PropagatedRequestData(), next);
  }
}
