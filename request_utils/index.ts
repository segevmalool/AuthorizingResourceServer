import type { Context } from 'koa';

export function parseProvidedSecretsHeader(providedSecrets: string | string[] | undefined) {
  if (!providedSecrets) {
    return [];
  }

  if (!Array.isArray(providedSecrets)) {
    providedSecrets = providedSecrets.split(',');
  }

  return providedSecrets;
}

export function getProvidedSecretsHeader(ctx: Context): string | string[] | undefined {
  // Note that koa will transform all header names into lowercase.
  return ctx.headers.resourcesecrets;
}
