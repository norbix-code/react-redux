import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

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
 * my arguments, query vs mutation, and the cache tags. The last describe
 * drives the real `@norbix.ai/ts` client (4.53.0 or newer) with a fake fetch —
 * never a real server — and checks the verb, the full path and where each
 * parameter goes.
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

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
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

describe('bundles and Flex clusters through the real SDK (fake fetch)', () => {
  function run(key: string, args: unknown, payload: unknown = { responseStatus: {} }) {
    // Only globalThis.* here: the lint config declares no DOM globals.
    type FetchFn = typeof globalThis.fetch;
    const seen: Array<{
      url: string;
      method: string;
      body: string | undefined;
      headers: InstanceType<typeof globalThis.Headers>;
    }> = [];
    const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
      seen.push({
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
        body: typeof init?.body === 'string' ? init.body : undefined,
        headers: new globalThis.Headers(init?.headers ?? {}),
      });
      return new globalThis.Response(JSON.stringify(payload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as FetchFn;
    const norbix = new Norbix({
      bearerToken: 'test-token',
      projectId: 'test-project',
      apiVersion: 'v2',
      hubVersion: 'v2',
      baseUrl: { api: 'https://api.norbix.io', hub: 'https://hub.norbix.io' },
      fetch: fetchImpl,
    });
    const baseQuery = createNorbixBaseQuery(() => norbix);
    const result = baseQuery(endpoints[key]!.query(args) as never, {} as never, {});
    return { seen, result };
  }

  const HUB = 'https://hub.norbix.io/v2';

  it('getManagedServiceBundles sends GET /v2/account/stripe/bundles with no body and returns the bundles', async () => {
    const bundles = [
      {
        bundle: 'Starter',
        projectCap: 3,
        monthly: { amount: 4900, currency: 'usd' },
        annual: { amount: 49000, currency: 'usd' },
      },
    ];
    const { seen, result } = run('getManagedServiceBundles', undefined, { bundles });
    const out = (await result) as { data?: { bundles?: unknown }; error?: unknown };
    expect(out.error).toBeUndefined();
    expect(out.data?.bundles).toEqual(bundles);
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('GET');
    expect(seen[0]!.url).toBe(`${HUB}/account/stripe/bundles`);
    expect(seen[0]!.body).toBeUndefined();
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('changeManagedServiceBundle sends POST /v2/account/stripe/change-bundle with bundle and billingPeriod in the JSON body', async () => {
    const { seen, result } = run('changeManagedServiceBundle', {
      bundle: 'Growth',
      billingPeriod: 'Annual',
    });
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe(`${HUB}/account/stripe/change-bundle`);
    expect(JSON.parse(seen[0]!.body!)).toEqual({ bundle: 'Growth', billingPeriod: 'Annual' });
  });

  it('getFlexClusters sends GET /v2/account/flex-clusters with no body and returns the clusters', async () => {
    const payload = {
      clusters: [{ id: 'flx_1', displayName: 'Main', tierCode: 'FLEX', status: 'Active' }],
      canCreateNew: false,
      cannotCreateReason: 'ClusterLimitReached',
    };
    const { seen, result } = run('getFlexClusters', undefined, payload);
    const out = (await result) as { data?: unknown; error?: unknown };
    expect(out.error).toBeUndefined();
    expect(out.data).toMatchObject(payload);
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('GET');
    expect(seen[0]!.url).toBe(`${HUB}/account/flex-clusters`);
    expect(seen[0]!.body).toBeUndefined();
  });

  it('upgradeFlexCluster sends POST /v2/account/flex-clusters/{flexClusterId}/upgrade: the id in the path, tierCode in the JSON body', async () => {
    const { seen, result } = run('upgradeFlexCluster', {
      flexClusterId: 'flx_1',
      tierCode: 'M10',
    });
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe(`${HUB}/account/flex-clusters/flx_1/upgrade`);
    expect(JSON.parse(seen[0]!.body!)).toEqual({ tierCode: 'M10' });
  });
});
