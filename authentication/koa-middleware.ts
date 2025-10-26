import type {Context, Next} from 'koa';
import {AuthenticationError, AuthorizingResourceServerError} from '../errors/index.js';
import {RequestLocalStorage} from '../localStorage/index.js';
import {Client} from './client.js';
import {ClientStorageSingleton} from './clientStorage.js';

export function withClientAuthentication() {
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

    const requestLocalStorage = RequestLocalStorage.getStore();

    if (!requestLocalStorage) {
      throw new AuthorizingResourceServerError('Local storage error');
    }

    requestLocalStorage.setClient(client);

    await next();
  };
}
