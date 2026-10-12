import { URL } from 'node:url';

import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubCode } from '../src/hooks/hub/code.js';

/**
 * The `hub.code` hooks — the module switch, the Code integrations and the
 * cloud functions (list, qualifiers, invoke, event sample, runs). The hooks are
 * a 1:1 wrapper, so the contract is: the hook reaches the right SDK method
 * with the caller's arguments, is a query or a mutation as expected, and
 * carries the cache tags the dashboard relies on. The last describe drives the
 * real `@norbix.ai/ts` client with a fake fetch — never a real server.
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

/** hook name → [kind, SDK method on norbix.hub.code]. */
const CODE: Record<string, ['query' | 'mutation', string]> = {
  enableCodeModule: ['mutation', 'enableCode'],
  disableCodeModule: ['mutation', 'disableCode'],
  getCodeIntegrations: ['query', 'getCodeIntegrations'],
  getCodeIntegration: ['query', 'getCodeIntegration'],
  saveCodeIntegration: ['mutation', 'saveCodeIntegration'],
  deleteCodeIntegration: ['mutation', 'deleteCodeIntegration'],
  enableCodeIntegration: ['mutation', 'enableCodeIntegration'],
  disableCodeIntegration: ['mutation', 'disableCodeIntegration'],
  testCodeIntegration: ['mutation', 'testCodeIntegration'],
  getCodeFunctions: ['query', 'getCodeFunctions'],
  getCodeFunctionQualifiers: ['query', 'getCodeFunctionQualifiers'],
  getCodeFunctionEventSample: ['query', 'getCodeFunctionEventSample'],
  getCodeFunctionRuns: ['query', 'getCodeFunctionRuns'],
  invokeCodeFunction: ['mutation', 'invokeCodeFunction'],
};
const NAMES = Object.keys(CODE);

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
  };
  const code = Object.fromEntries(NAMES.map((n) => [CODE[n]![1], record(CODE[n]![1])]));
  return { calls, client: { hub: { code } } };
}

function tagsFor(tags: Tags | undefined, arg: unknown): unknown {
  return typeof tags === 'function' ? tags(undefined, undefined, arg) : tags;
}

const endpoints = hubCode(fakeBuilder()) as unknown as Record<string, Def>;

const INTEGRATION = 'int_6rBACnEaxQ0x1jTiHtAuWV';

describe('hubCode', () => {
  it('covers the module switch, the 8 integration endpoints and the 5 function endpoints', () => {
    expect(Object.keys(endpoints).sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s reaches the matching SDK method with the caller args', async (key) => {
    const { calls, client } = fakeNorbix();
    const args = { id: INTEGRATION, integrationId: INTEGRATION };

    await endpoints[key]!.query(args)(client);

    expect(calls).toEqual([{ method: CODE[key]![1], args }]);
  });

  it.each(NAMES)('%s is a %s', (key) => {
    expect(endpoints[key]!.__kind).toBe(CODE[key]![0]);
  });

  it('module switch invalidates Account, Projects and Code', () => {
    for (const key of ['enableCodeModule', 'disableCodeModule']) {
      expect(tagsFor(endpoints[key]!.invalidatesTags, undefined)).toEqual([
        'Account',
        'Projects',
        'Code',
      ]);
    }
  });

  it('the integration list provides CodeIntegrations/LIST; one integration provides CodeIntegrations/<id>', () => {
    expect(tagsFor(endpoints['getCodeIntegrations']!.providesTags, {})).toEqual([
      { type: 'CodeIntegrations', id: 'LIST' },
    ]);
    expect(tagsFor(endpoints['getCodeIntegration']!.providesTags, { id: INTEGRATION })).toEqual([
      { type: 'CodeIntegrations', id: INTEGRATION },
    ]);
  });

  it.each(['deleteCodeIntegration', 'enableCodeIntegration', 'disableCodeIntegration'])(
    '%s invalidates the list and the integration (the SDK spells the path token Id)',
    (key) => {
      expect(tagsFor(endpoints[key]!.invalidatesTags, { Id: INTEGRATION })).toEqual([
        { type: 'CodeIntegrations', id: 'LIST' },
        { type: 'CodeIntegrations', id: INTEGRATION },
      ]);
    },
  );

  it('saveCodeIntegration invalidates the list and the saved integration (id), or CURRENT on create', () => {
    const tags = endpoints['saveCodeIntegration']!.invalidatesTags;
    expect(tagsFor(tags, { id: INTEGRATION })).toEqual([
      { type: 'CodeIntegrations', id: 'LIST' },
      { type: 'CodeIntegrations', id: INTEGRATION },
    ]);
    expect(tagsFor(tags, { displayName: 'Lambda eu-central-1' })).toEqual([
      { type: 'CodeIntegrations', id: 'LIST' },
      { type: 'CodeIntegrations', id: 'CURRENT' },
    ]);
  });

  it('test invalidates nothing', () => {
    expect(endpoints['testCodeIntegration']!.invalidatesTags).toBeUndefined();
  });

  it('functions and qualifiers provide CodeFunctions/LIST, runs RUNS, the sample SAMPLE; invoke invalidates nothing', () => {
    expect(tagsFor(endpoints['getCodeFunctions']!.providesTags, {})).toEqual([
      { type: 'CodeFunctions', id: 'LIST' },
    ]);
    expect(tagsFor(endpoints['getCodeFunctionQualifiers']!.providesTags, {})).toEqual([
      { type: 'CodeFunctions', id: 'LIST' },
    ]);
    expect(tagsFor(endpoints['getCodeFunctionRuns']!.providesTags, {})).toEqual([
      { type: 'CodeFunctions', id: 'RUNS' },
    ]);
    expect(tagsFor(endpoints['getCodeFunctionEventSample']!.providesTags, {})).toEqual([
      { type: 'CodeFunctions', id: 'SAMPLE' },
    ]);
    expect(endpoints['invokeCodeFunction']!.invalidatesTags).toBeUndefined();
  });
});

/**
 * Through the real `@norbix.ai/ts` client and this package's base query with a
 * fake fetch: verb, route, where the fields go (query string on GET, JSON body
 * on POST), and the project scope headers.
 */
describe('code hooks through the real SDK (fake fetch)', () => {
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

  it('getCodeFunctions sends GET /code/functions with the filters in the query string', async () => {
    const { seen, result } = run('getCodeFunctions', {
      integrationId: INTEGRATION,
      prefix: 'orders-',
      tag: 'norbix=bookshop',
    });
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('GET');
    const url = new URL(seen[0]!.url);
    expect(`${url.origin}${url.pathname}`).toBe(`${HUB}/code/functions`);
    expect(url.searchParams.get('integrationId')).toBe(INTEGRATION);
    expect(url.searchParams.get('prefix')).toBe('orders-');
    expect(url.searchParams.get('tag')).toBe('norbix=bookshop');
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0]!.headers.get('norbix-project-id')).toBe('test-project');
  });

  it.each([
    [
      'getCodeFunctionQualifiers',
      'qualifiers',
      { integrationId: INTEGRATION, functionId: 'orders-on-update' },
    ],
    [
      'getCodeFunctionEventSample',
      'event-sample',
      { source: 'Database', event: 'database.record.updated' },
    ],
    ['getCodeFunctionRuns', 'runs', { triggerId: 'trg_1', limit: 5 }],
  ])('%s sends GET /code/functions/%s', async (key, segment, args) => {
    const { seen, result } = run(key, args);
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('GET');
    const url = new URL(seen[0]!.url);
    expect(`${url.origin}${url.pathname}`).toBe(`${HUB}/code/functions/${segment}`);
    for (const [k, v] of Object.entries(args)) expect(url.searchParams.get(k)).toBe(String(v));
  });

  it('invokeCodeFunction sends POST /code/functions/invoke with the functionRef and payload in the body', async () => {
    const args = {
      functionRef: {
        integrationId: INTEGRATION,
        functionId: 'orders-on-update',
        qualifier: 'prod',
      },
      payload: { orderId: '6ac54a59212c29912eaddd81', dryRun: true },
      invocationType: 'Sync',
    };
    const { seen, result } = run('invokeCodeFunction', args);
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe(`${HUB}/code/functions/invoke`);
    expect(JSON.parse(seen[0]!.body!)).toEqual(args);
  });

  it('getCodeIntegration sends GET /code/integrations/<id>', async () => {
    const { seen, result } = run('getCodeIntegration', { id: INTEGRATION });
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('GET');
    expect(seen[0]!.url).toBe(`${HUB}/code/integrations/${INTEGRATION}`);
  });
});
