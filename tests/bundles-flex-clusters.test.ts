import { describe, expect, it } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { createNorbixApi } from '../src/createNorbixApi.js';
import { hubAccount } from '../src/hooks/hub/account.js';

/**
 * Bundles and Flex clusters — four `hub.account` hooks:
 *
 *   GET  /account/stripe/bundles                         getManagedServiceBundles
 *   POST /account/stripe/change-bundle                   changeManagedServiceBundle
 *   GET  /account/flex-clusters                          getFlexClusters
 *   POST /account/flex-clusters/{flexClusterId}/upgrade  upgradeFlexCluster
 *
 * The hooks are a 1:1 wrapper, so the contract is: the right SDK method with
 * my arguments, query vs mutation, and the cache tags. The verb and the path
 * belong to the core SDK. The `@norbix.ai/ts` this package builds against
 * does not have the four methods yet, so there is no test through the real
 * client here; add one (see `account-me.test.ts`) when the dependency is raised.
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

const HOOKS: Record<string, { kind: 'query' | 'mutation'; args: unknown; tags: string[] }> = {
  getManagedServiceBundles: { kind: 'query', args: undefined, tags: ['Billing'] },
  changeManagedServiceBundle: {
    kind: 'mutation',
    args: { bundle: 'Growth', billingPeriod: 'Annual' },
    tags: ['Billing', 'Account'],
  },
  getFlexClusters: { kind: 'query', args: undefined, tags: ['Account', 'DatabaseIntegrations'] },
  upgradeFlexCluster: {
    kind: 'mutation',
    args: { flexClusterId: 'flx_1', tierCode: 'M10' },
    tags: ['DatabaseIntegrations'],
  },
};
const NAMES = Object.keys(HOOKS);

function fakeNorbix(answer: unknown = { ok: true }) {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve(answer);
  };
  const account = Object.fromEntries(NAMES.map((n) => [n, record(n)]));
  return { calls, client: { hub: { account } } };
}

const endpoints = hubAccount(fakeBuilder()) as unknown as Record<string, Def>;

describe('hubAccount — bundles and Flex clusters', () => {
  it('ships the four hooks', () => {
    for (const key of NAMES) expect(endpoints[key]).toBeDefined();
  });

  it.each(NAMES)('%s reaches the matching SDK method with the caller args', async (key) => {
    const { calls, client } = fakeNorbix();

    await endpoints[key]!.query(HOOKS[key]!.args)(client);

    expect(calls).toEqual([{ method: key, args: HOOKS[key]!.args }]);
  });

  it.each(NAMES)('%s has the right kind and cache tags', (key) => {
    const { kind, tags } = HOOKS[key]!;
    expect(endpoints[key]!.__kind).toBe(kind);
    expect(endpoints[key]![kind === 'query' ? 'providesTags' : 'invalidatesTags']).toEqual(tags);
  });

  it('a bundle change re-reads what shows the bundle: account status, licenses, the bundle list', () => {
    const invalidated = endpoints['changeManagedServiceBundle']!.invalidatesTags as string[];
    expect(invalidated).toEqual(
      expect.arrayContaining(endpoints['getAccountStatus']!.providesTags as string[]),
    );
    expect(invalidated).toEqual(
      expect.arrayContaining(endpoints['getLicenses']!.providesTags as string[]),
    );
    expect(invalidated).toContain('Billing');
  });

  it('the cluster list is read again after an upgrade', () => {
    const provided = endpoints['getFlexClusters']!.providesTags as string[];
    const invalidated = endpoints['upgradeFlexCluster']!.invalidatesTags as string[];
    expect(provided.some((tag) => invalidated.includes(tag))).toBe(true);
  });
});

describe('bundles and Flex clusters on the API slice', () => {
  it.each([
    'useGetManagedServiceBundlesQuery',
    'useChangeManagedServiceBundleMutation',
    'useGetFlexClustersQuery',
    'useUpgradeFlexClusterMutation',
  ])('createNorbixApi ships %s', (hook) => {
    const api = createNorbixApi(() => fakeNorbix().client as never) as unknown as Record<
      string,
      unknown
    >;
    expect(typeof api[hook]).toBe('function');
  });
});

describe('bundles and Flex clusters through the base query', () => {
  it('returns the SDK answer as data', async () => {
    const answer = {
      bundles: [
        {
          bundle: 'Starter',
          projectCap: 3,
          monthly: { amount: 4900, currency: 'usd' },
          annual: { amount: 49000, currency: 'usd' },
        },
      ],
    };
    const { client } = fakeNorbix(answer);
    const baseQuery = createNorbixBaseQuery(() => client as never);

    const out = await baseQuery(
      endpoints['getManagedServiceBundles']!.query(undefined) as never,
      {} as never,
      {},
    );

    expect(out).toEqual({ data: answer });
  });

  it.each(NAMES)(
    '%s answers with an error, not a throw, on a core SDK without the method',
    async (key) => {
      const olderSdk = { hub: { account: {} } };
      const baseQuery = createNorbixBaseQuery(() => olderSdk as never);

      const out = (await baseQuery(
        endpoints[key]!.query(HOOKS[key]!.args) as never,
        {} as never,
        {},
      )) as { data?: unknown; error?: { message?: string } };

      expect(out.data).toBeUndefined();
      expect(out.error).toBeDefined();
    },
  );
});
