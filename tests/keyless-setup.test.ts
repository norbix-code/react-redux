import { describe, expect, it } from 'vitest';

import { hubIntegrations } from '../src/hooks/hub/integrations.js';
import { buildEndpoints } from '../src/hooks/index.js';

/**
 * `hub.integrations` hooks — the keyless cloud connection setup (gateway
 * feat/keyless-cloud). Fake builder and fake client: the hook is a 1:1 wrapper
 * of the core SDK, so "it reached the right SDK method with my arguments" and
 * the (absent) cache tags are the whole contract.
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => ({ ...def, __kind: 'query' }),
    mutation: (def: Record<string, unknown>) => ({ ...def, __kind: 'mutation' }),
  } as never;
}

type Def = {
  __kind: 'query' | 'mutation';
  query: (args: unknown) => (norbix: unknown) => unknown;
  providesTags?: unknown;
  invalidatesTags?: unknown;
};

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const integrations = new Proxy(
    {},
    {
      get: (_t, name: string) => (args: unknown) => {
        calls.push({ method: `hub.integrations.${name}`, args });
        return Promise.resolve({ available: true });
      },
    },
  );
  return { calls, client: { hub: { integrations } } };
}

describe('hubIntegrations', () => {
  const endpoints = hubIntegrations(fakeBuilder()) as unknown as Record<string, Def>;

  it('getKeylessIntegrationSetup is a query that reaches the SDK method with the caller args', async () => {
    const { calls, client } = fakeNorbix();
    const args = { module: 'files', cloud: 'aws', integrationId: 'int_1' };

    const result = await endpoints.getKeylessIntegrationSetup.query(args)(client);

    expect(endpoints.getKeylessIntegrationSetup.__kind).toBe('query');
    expect(endpoints.getKeylessIntegrationSetup.providesTags).toBeUndefined();
    expect(calls).toEqual([{ method: 'hub.integrations.getKeylessIntegrationSetup', args }]);
    expect(result).toEqual({ available: true });
  });

  it('is part of the full endpoint set', () => {
    const all = buildEndpoints(fakeBuilder()) as unknown as Record<string, Def>;
    expect(all).toHaveProperty('getKeylessIntegrationSetup');
  });
});
