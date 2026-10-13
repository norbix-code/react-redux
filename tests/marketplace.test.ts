import { URL } from 'node:url';

import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubCodeMarketplace } from '../src/hooks/hub/marketplace.js';

/**
 * The marketplace hooks of `hub.code` (gateway contract Code.Marketplace.md
 * §14). The hooks are a 1:1 wrapper, so the contract is: each hook reaches
 * the right SDK method with the caller's arguments, is a query or a mutation
 * as expected, carries the cache tags, and — through the real `@norbix.ai/ts`
 * client with a fake fetch, never a real server — sends the verb, the path
 * with the ids filled in, and the fields in the query string (GET / DELETE)
 * or the JSON body (POST / PUT).
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => ({ ...def, __kind: 'query' }),
    mutation: (def: Record<string, unknown>) => ({ ...def, __kind: 'mutation' }),
  } as never;
}

type Tags = unknown[] | ((res: unknown, err: unknown, arg: unknown) => unknown[]);

type Def = {
  __kind: 'query' | 'mutation';
  query: (args: unknown) => (norbix: unknown) => unknown;
  providesTags?: Tags;
  invalidatesTags?: Tags;
};

const INTEGRATION = 'int_6Qp1dW2kRm8NsT4vYc0Hb';
const FUNCTION = 'func_4hT2b9QkLm3XcT1yRfGh7a';
const LISTING = 'ml_slack_v1';
const IDS = { integrationViewId: INTEGRATION };
const FN_IDS = { integrationViewId: INTEGRATION, functionViewId: FUNCTION };
const I = `/code/marketplace/integrations/${INTEGRATION}`;

/** hook → kind, verb, path after /v2, the caller's args, the fields that must go on the wire. */
const CASES: Array<
  [string, 'query' | 'mutation', string, string, Record<string, unknown>, Record<string, unknown>]
> = [
  [
    'getMarketplaceListings',
    'query',
    'GET',
    '/code/marketplace/listings',
    { search: 'slack' },
    { search: 'slack' },
  ],
  [
    'getMarketplaceListing',
    'query',
    'GET',
    `/code/marketplace/listings/${LISTING}`,
    { listingViewId: LISTING },
    {},
  ],
  [
    'getMarketplaceListingFunctionTokens',
    'query',
    'GET',
    `/code/marketplace/listings/${LISTING}/functions/slack.post-message/tokens`,
    { listingViewId: LISTING, functionKey: 'slack.post-message' },
    {},
  ],
  ['getMarketplaceIntegrations', 'query', 'GET', '/code/marketplace/integrations', {}, {}],
  ['getMarketplaceIntegration', 'query', 'GET', I, IDS, {}],
  [
    'saveMarketplaceIntegration',
    'mutation',
    'POST',
    '/code/marketplace/integrations',
    { integration: { listingViewId: LISTING }, secrets: { botToken: 'xoxb-test' } },
    { integration: { listingViewId: LISTING }, secrets: { botToken: 'xoxb-test' } },
  ],
  ['deleteMarketplaceIntegration', 'mutation', 'DELETE', I, IDS, {}],
  ['enableMarketplaceIntegration', 'mutation', 'POST', `${I}/enable`, IDS, {}],
  ['disableMarketplaceIntegration', 'mutation', 'POST', `${I}/disable`, IDS, {}],
  [
    'replaceMarketplaceIntegrationSecrets',
    'mutation',
    'PUT',
    `${I}/secrets`,
    { ...IDS, secrets: { botToken: 'xoxb-new' } },
    { secrets: { botToken: 'xoxb-new' } },
  ],
  ['revealMarketplaceIntegrationSecrets', 'mutation', 'POST', `${I}/secrets/reveal`, IDS, {}],
  [
    'setMarketplaceIntegrationTokenMappings',
    'mutation',
    'PUT',
    `${I}/token-mappings`,
    { ...IDS, tokenMappings: [{ key: 'channel', value: '#orders', resolver: 'Custom' }] },
    { tokenMappings: [{ key: 'channel', value: '#orders', resolver: 'Custom' }] },
  ],
  ['testMarketplaceIntegration', 'mutation', 'POST', `${I}/test`, IDS, {}],
  ['getMarketplaceFunctionCatalog', 'query', 'GET', `${I}/catalog`, IDS, {}],
  ['getMarketplaceIntegrationTools', 'query', 'GET', `${I}/tools`, IDS, {}],
  ['getMarketplaceFunctions', 'query', 'GET', `${I}/functions`, IDS, {}],
  ['getMarketplaceFunction', 'query', 'GET', `${I}/functions/${FUNCTION}`, FN_IDS, {}],
  [
    'saveMarketplaceFunction',
    'mutation',
    'POST',
    `${I}/functions`,
    { ...IDS, function: { functionKey: 'slack.post-message', displayName: 'Post order' } },
    { function: { functionKey: 'slack.post-message', displayName: 'Post order' } },
  ],
  ['deleteMarketplaceFunction', 'mutation', 'DELETE', `${I}/functions/${FUNCTION}`, FN_IDS, {}],
  [
    'enableMarketplaceFunction',
    'mutation',
    'POST',
    `${I}/functions/${FUNCTION}/enable`,
    FN_IDS,
    {},
  ],
  [
    'disableMarketplaceFunction',
    'mutation',
    'POST',
    `${I}/functions/${FUNCTION}/disable`,
    FN_IDS,
    {},
  ],
  ['getMarketplaceFunctionTokens', 'query', 'GET', `${I}/functions/${FUNCTION}/tokens`, FN_IDS, {}],
  [
    'invokeMarketplaceFunction',
    'mutation',
    'POST',
    `/code/marketplace/functions/${FUNCTION}/invoke`,
    { functionViewId: FUNCTION, payload: { text: 'Order shipped' } },
    { payload: { text: 'Order shipped' } },
  ],
  [
    'getMarketplaceFunctionRuns',
    'query',
    'GET',
    '/code/marketplace/functions/runs',
    { triggerId: 'trg_1p4R3gTobGZpD6fXvHT4rd', limit: 5 },
    { triggerId: 'trg_1p4R3gTobGZpD6fXvHT4rd', limit: 5 },
  ],
];
const NAMES = CASES.map((c) => c[0]);

function tagsFor(tags: Tags | undefined, arg: unknown): unknown {
  return typeof tags === 'function' ? tags(undefined, undefined, arg) : tags;
}

const endpoints = hubCodeMarketplace(fakeBuilder()) as unknown as Record<string, Def>;

describe('hubCodeMarketplace', () => {
  it('wraps the 24 marketplace methods of the published core SDK', () => {
    expect(Object.keys(endpoints).sort()).toEqual([...NAMES].sort());
  });

  it.each(CASES.map((c) => [c[0], c[1]] as const))(
    '%s is a %s and reaches the SDK method of the same name with the caller args',
    async (key, kind) => {
      expect(endpoints[key]!.__kind).toBe(kind);
      const calls: Array<{ method: string; args: unknown }> = [];
      const code = {
        [key]: (args: unknown) => (calls.push({ method: key, args }), Promise.resolve({})),
      };
      const args = { ...FN_IDS, marker: key };
      await endpoints[key]!.query(args)({ hub: { code } });
      expect(calls).toEqual([{ method: key, args }]);
    },
  );

  it('catalog reads provide LISTINGS, the connection list INTEGRATIONS, one connection its id', () => {
    for (const key of [
      'getMarketplaceListings',
      'getMarketplaceListing',
      'getMarketplaceListingFunctionTokens',
    ]) {
      expect(tagsFor(endpoints[key]!.providesTags, {})).toEqual([
        { type: 'CodeMarketplace', id: 'LISTINGS' },
      ]);
    }
    expect(tagsFor(endpoints['getMarketplaceIntegrations']!.providesTags, {})).toEqual([
      { type: 'CodeMarketplace', id: 'INTEGRATIONS' },
    ]);
    expect(tagsFor(endpoints['getMarketplaceIntegration']!.providesTags, IDS)).toEqual([
      { type: 'CodeMarketplace', id: INTEGRATION },
    ]);
    expect(tagsFor(endpoints['getMarketplaceFunctionCatalog']!.providesTags, IDS)).toEqual([
      { type: 'CodeMarketplace', id: `CATALOG:${INTEGRATION}` },
    ]);
  });

  it('connection writes invalidate the list and the connection; delete also its functions', () => {
    for (const key of ['enableMarketplaceIntegration', 'disableMarketplaceIntegration']) {
      expect(tagsFor(endpoints[key]!.invalidatesTags, IDS)).toEqual([
        { type: 'CodeMarketplace', id: 'INTEGRATIONS' },
        { type: 'CodeMarketplace', id: INTEGRATION },
      ]);
    }
    expect(tagsFor(endpoints['deleteMarketplaceIntegration']!.invalidatesTags, IDS)).toEqual([
      { type: 'CodeMarketplace', id: 'INTEGRATIONS' },
      { type: 'CodeMarketplace', id: INTEGRATION },
      { type: 'CodeMarketplace', id: `FUNCTIONS:${INTEGRATION}` },
      { type: 'CodeMarketplace', id: `TOOLS:${INTEGRATION}` },
    ]);
    expect(tagsFor(endpoints['saveMarketplaceIntegration']!.invalidatesTags, {})).toEqual([
      { type: 'CodeMarketplace', id: 'INTEGRATIONS' },
    ]);
    for (const key of [
      'replaceMarketplaceIntegrationSecrets',
      'setMarketplaceIntegrationTokenMappings',
    ]) {
      expect(tagsFor(endpoints[key]!.invalidatesTags, IDS)).toEqual([
        { type: 'CodeMarketplace', id: INTEGRATION },
      ]);
    }
    // Validation lists the MCP server's tools again and stores the catalog (gateway item mcp-step1).
    expect(tagsFor(endpoints['testMarketplaceIntegration']!.invalidatesTags, IDS)).toEqual([
      { type: 'CodeMarketplace', id: INTEGRATION },
      { type: 'CodeMarketplace', id: `TOOLS:${INTEGRATION}` },
    ]);
  });

  it('the MCP tool catalog provides TOOLS:<integration> (core SDK 4.23.0)', () => {
    expect(tagsFor(endpoints['getMarketplaceIntegrationTools']!.providesTags, IDS)).toEqual([
      { type: 'CodeMarketplace', id: `TOOLS:${INTEGRATION}` },
    ]);
  });

  it('the last runs provide CodeMarketplace/RUNS', () => {
    expect(tagsFor(endpoints['getMarketplaceFunctionRuns']!.providesTags, {})).toEqual([
      { type: 'CodeMarketplace', id: 'RUNS' },
    ]);
  });

  it('reveal and invoke invalidate nothing (reveal is a mutation so clear secrets are never cached)', () => {
    expect(endpoints['revealMarketplaceIntegrationSecrets']!.__kind).toBe('mutation');
    expect(endpoints['revealMarketplaceIntegrationSecrets']!.invalidatesTags).toBeUndefined();
    expect(endpoints['invokeMarketplaceFunction']!.invalidatesTags).toBeUndefined();
  });

  it('function reads provide FUNCTIONS:<integration> or the function id; writes invalidate both', () => {
    expect(tagsFor(endpoints['getMarketplaceFunctions']!.providesTags, IDS)).toEqual([
      { type: 'CodeMarketplace', id: `FUNCTIONS:${INTEGRATION}` },
    ]);
    for (const key of ['getMarketplaceFunction', 'getMarketplaceFunctionTokens']) {
      expect(tagsFor(endpoints[key]!.providesTags, FN_IDS)).toEqual([
        { type: 'CodeMarketplace', id: FUNCTION },
      ]);
    }
    for (const key of [
      'saveMarketplaceFunction',
      'deleteMarketplaceFunction',
      'enableMarketplaceFunction',
      'disableMarketplaceFunction',
    ]) {
      expect(tagsFor(endpoints[key]!.invalidatesTags, FN_IDS)).toEqual([
        { type: 'CodeMarketplace', id: `FUNCTIONS:${INTEGRATION}` },
        { type: 'CodeMarketplace', id: FUNCTION },
      ]);
    }
  });
});

describe('marketplace hooks through the real SDK (fake fetch)', () => {
  function run(key: string, args: unknown) {
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
      return new globalThis.Response(JSON.stringify({ responseStatus: { isSuccess: true } }), {
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

  it.each(CASES)('%s (%s) sends %s %s', async (key, _kind, verb, path, args, wire) => {
    const { seen, result } = run(key, args);
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe(verb);
    const url = new URL(seen[0]!.url);
    expect(`${url.origin}${url.pathname}`).toBe(`${HUB}${path}`);
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0]!.headers.get('norbix-project-id')).toBe('test-project');
    if (verb === 'GET' || verb === 'DELETE') {
      const query = Object.fromEntries(
        [...url.searchParams.entries()].filter(([k]) => k !== 'env'),
      );
      expect(query).toEqual(
        Object.fromEntries(Object.entries(wire).map(([k, v]) => [k, String(v)])),
      );
      expect(seen[0]!.body).toBeUndefined();
    } else {
      expect(url.search).toBe('');
      const body =
        seen[0]!.body === undefined ? {} : (JSON.parse(seen[0]!.body) as Record<string, unknown>);
      expect(body).toEqual(wire);
    }
  });

  // Exactly one of functionId / triggerId / taskId (gateway item gw-runs, @norbix.ai/ts 4.22.0):
  // a function's own runs from every source. The typed arg below only compiles on 4.22.0+.
  it('getMarketplaceFunctionRuns takes functionId and sends it on the query, no body', async () => {
    const args: NonNullable<Parameters<Norbix['hub']['code']['getMarketplaceFunctionRuns']>[0]> = {
      functionId: 'func_1p4R3gTobGZpD6fXvHT4rd',
      limit: 50,
    };
    const { seen, result } = run('getMarketplaceFunctionRuns', args);
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('GET');
    const url = new URL(seen[0]!.url);
    expect(`${url.origin}${url.pathname}`).toBe(`${HUB}/code/marketplace/functions/runs`);
    expect(
      Object.fromEntries([...url.searchParams.entries()].filter(([k]) => k !== 'env')),
    ).toEqual({
      functionId: 'func_1p4R3gTobGZpD6fXvHT4rd',
      limit: '50',
    });
    expect(seen[0]!.body).toBeUndefined();
  });
});
