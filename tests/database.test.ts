import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { apiDatabase } from '../src/hooks/api/database.js';
import { hubDatabase } from '../src/hooks/hub/database.js';
import { buildEndpoints } from '../src/hooks/index.js';

/**
 * Same fake builder the files / integrations tests use: RTK Query's real
 * builder is internally complex, and what we check here is the shape of the
 * definitions and what each one does with the client.
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => ({ ...def, __kind: 'query' }),
    mutation: (def: Record<string, unknown>) => ({ ...def, __kind: 'mutation' }),
  } as never;
}

type TagFn = (r: unknown, e: unknown, arg: unknown) => unknown;
type Def = {
  __kind: 'query' | 'mutation';
  query: (args: unknown) => (norbix: unknown) => unknown;
  providesTags?: unknown[] | TagFn;
  invalidatesTags?: unknown[] | TagFn;
};

/** The SDK method names of a module, read from a real client (functions only). */
function sdkMethods(surface: 'hub' | 'api'): string[] {
  const norbix = new Norbix({ bearerToken: 't', projectId: 'p' });
  const mod = norbix[surface].database as unknown as Record<string, unknown>;
  return Object.keys(mod)
    .filter((k) => typeof mod[k] === 'function')
    .sort();
}

/**
 * Fake transport: a stand-in Norbix client that records which SDK method was
 * called and with what. No HTTP, no server — the hooks are a 1:1 wrapper, so
 * "it reached the right SDK method with my arguments" is the whole contract.
 */
function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const module = (surface: 'hub' | 'api') =>
    Object.fromEntries(
      sdkMethods(surface).map((n) => [
        n,
        (args: unknown) => {
          calls.push({ method: `${surface}.${n}`, args });
          return Promise.resolve({ ok: true });
        },
      ]),
    );
  return { calls, client: { hub: { database: module('hub') }, api: { database: module('api') } } };
}

function tags(def: Def, key: 'providesTags' | 'invalidatesTags', arg: unknown) {
  const t = def[key];
  return typeof t === 'function' ? t(undefined, undefined, arg) : t;
}

const RECORD_READS = ['findRecords', 'findOneRecord', 'countRecords', 'distinctRecordValues'];
const RECORD_WRITES = [
  'insertRecord',
  'insertManyRecords',
  'updateOneRecord',
  'updateManyRecords',
  'replaceRecord',
  'deleteRecord',
  'deleteManyRecords',
  'changeRecordResponsibility',
];

describe('hubDatabase', () => {
  const endpoints = hubDatabase(fakeBuilder()) as unknown as Record<string, Def>;

  it('has one hook per hub.database method of @norbix.ai/ts, same name (74)', () => {
    const methods = sdkMethods('hub');
    expect(methods).toHaveLength(74);
    expect(Object.keys(endpoints).sort()).toEqual(methods);
  });

  it('every hook reaches its own SDK method with the caller args', async () => {
    const { calls, client } = fakeNorbix();
    for (const key of Object.keys(endpoints)) {
      await endpoints[key].query({ probe: key })(client);
    }
    expect(calls).toEqual(
      Object.keys(endpoints).map((key) => ({ method: `hub.${key}`, args: { probe: key } })),
    );
  });

  it('record reads are queries cached per collection', () => {
    for (const key of RECORD_READS) {
      expect(endpoints[key].__kind).toBe('query');
      expect(tags(endpoints[key], 'providesTags', { collectionName: 'orders' })).toEqual([
        { type: 'DatabaseRecords', id: 'orders' },
      ]);
      // No collection name: falls back to one shared id, never undefined.
      expect(tags(endpoints[key], 'providesTags', undefined)).toEqual([
        { type: 'DatabaseRecords', id: 'ANY' },
      ]);
    }
  });

  it('record writes are mutations that invalidate only their collection', () => {
    for (const key of RECORD_WRITES) {
      expect(endpoints[key].__kind).toBe('mutation');
      expect(tags(endpoints[key], 'invalidatesTags', { collectionName: 'orders' })).toEqual([
        { type: 'DatabaseRecords', id: 'orders' },
      ]);
    }
  });

  it('seeding writes several collections, so it invalidates every record list', () => {
    expect(endpoints.seedCollectionRecords.__kind).toBe('mutation');
    expect(endpoints.seedCollectionRecords.invalidatesTags).toEqual(['DatabaseRecords']);
  });

  it('aggregations and import helpers are uncached mutations that invalidate nothing', () => {
    for (const key of [
      'aggregateRecords',
      'executeRecordsAggregate',
      'analyzeImportFile',
      'requestImportUploadUrl',
    ]) {
      expect(endpoints[key].__kind).toBe('mutation');
      expect(endpoints[key].invalidatesTags).toBeUndefined();
    }
  });

  it('collection indexes are cached per collection', () => {
    expect(endpoints.getCollectionIndexes.__kind).toBe('query');
    expect(
      tags(endpoints.getCollectionIndexes, 'providesTags', { collectionName: 'orders' }),
    ).toEqual([{ type: 'DatabaseCollections', id: 'orders' }]);
  });

  it('term trees are cached per taxonomy; the taxonomy tree by both tags', () => {
    for (const key of ['getDatabaseTaxonomyTermTree', 'getDatabaseMergedTermTree']) {
      expect(endpoints[key].__kind).toBe('query');
      expect(tags(endpoints[key], 'providesTags', { taxonomyName: 'Countries' })).toEqual([
        { type: 'DatabaseTaxonomyTerms', id: 'Countries' },
      ]);
    }
    expect(endpoints.getDatabaseTaxonomyTree.providesTags).toEqual([
      'DatabaseTaxonomies',
      'DatabaseTaxonomyTerms',
    ]);
  });

  it('a term write refetches every term tree (whole-tag invalidation)', () => {
    // The merged tree crosses taxonomies (Countries + Cities), so a write to
    // one taxonomy must refetch trees cached under another taxonomy's id.
    for (const key of [
      'saveDatabaseTaxonomyTerm',
      'updateDatabaseTaxonomyTerm',
      'deleteDatabaseTaxonomyTerm',
    ]) {
      expect(endpoints[key].invalidatesTags).toEqual(['DatabaseTaxonomyTerms']);
    }
  });

  it('the schema bundle invalidates schemas, taxonomies and terms', () => {
    expect(endpoints.applyDatabaseSchemaBundle.__kind).toBe('mutation');
    expect(endpoints.applyDatabaseSchemaBundle.invalidatesTags).toEqual([
      'DatabaseSchemas',
      'DatabaseTaxonomies',
      'DatabaseTaxonomyTerms',
    ]);
  });

  it('embed and list settings live on the schema cache', () => {
    expect(endpoints.getDatabaseSchemaListSettings.__kind).toBe('query');
    expect(endpoints.getDatabaseSchemaListSettings.providesTags).toEqual(['DatabaseSchemas']);
    expect(endpoints.getDatabaseSchemaIndexStatus.__kind).toBe('query');
    expect(tags(endpoints.getDatabaseSchemaIndexStatus, 'providesTags', { id: 'sch_1' })).toEqual([
      { type: 'DatabaseSchemas', id: 'sch_1' },
    ]);
    for (const key of ['updateDatabaseSchemaListSettings', 'updateDatabaseSchemaEmbed']) {
      expect(endpoints[key].__kind).toBe('mutation');
      expect(endpoints[key].invalidatesTags).toEqual(['DatabaseSchemas']);
    }
  });

  it('collection imports: reads provide, writes invalidate DatabaseImports', () => {
    for (const key of ['getCollectionImports', 'getCollectionImport']) {
      expect(endpoints[key].__kind).toBe('query');
      expect(endpoints[key].providesTags).toEqual(['DatabaseImports']);
    }
    expect(endpoints.deleteCollectionImport.invalidatesTags).toEqual(['DatabaseImports']);
    // An import writes records into its target collection.
    expect(
      tags(endpoints.createCollectionImport, 'invalidatesTags', { collectionName: 'orders' }),
    ).toEqual([{ type: 'DatabaseImports' }, { type: 'DatabaseRecords', id: 'orders' }]);
  });
});

describe('apiDatabase', () => {
  const endpoints = apiDatabase(fakeBuilder()) as unknown as Record<string, Def>;

  it('reaches every api.database method of @norbix.ai/ts exactly once (22)', async () => {
    const { calls, client } = fakeNorbix();
    for (const key of Object.keys(endpoints)) {
      await endpoints[key].query({ probe: key })(client);
    }
    const methods = sdkMethods('api');
    expect(methods).toHaveLength(22);
    expect(calls.map((c) => c.method).sort()).toEqual(methods.map((m) => `api.${m}`));
  });

  it.each([
    ['findOwn', 'api.findOwn', { collectionName: 'orders' }],
    ['findMergedTermTree', 'api.findMergedTermTree', { taxonomyName: 'Countries' }],
  ])('%s reaches %s with the caller args', async (key, method, args) => {
    const { calls, client } = fakeNorbix();

    await endpoints[key].query(args)(client);

    expect(calls).toEqual([{ method, args }]);
  });

  it('findOwn is a query on the same collection cache as find', () => {
    expect(endpoints.findOwn.__kind).toBe('query');
    const arg = { collectionName: 'orders' };
    expect(tags(endpoints.findOwn, 'providesTags', arg)).toEqual(
      tags(endpoints.findCollection, 'providesTags', arg),
    );
    // So an insertOne on that collection refetches findOwn too.
    expect(tags(endpoints.insertOne, 'invalidatesTags', arg)).toEqual([
      { type: 'DatabaseCollections', id: 'orders' },
    ]);
  });

  it('findMergedTermTree is a query cached per taxonomy', () => {
    expect(endpoints.findMergedTermTree.__kind).toBe('query');
    expect(
      tags(endpoints.findMergedTermTree, 'providesTags', { taxonomyName: 'Countries' }),
    ).toEqual([{ type: 'DatabaseTaxonomyTerms', id: 'Countries' }]);
  });
});

describe('database hooks in the flat endpoint map', () => {
  it('no Hub database hook shadows an Api one, or the other way round', async () => {
    // buildEndpoints spreads every factory into ONE flat map, Hub after Api,
    // so an Api key equal to a Hub key would be silently replaced.
    const all = buildEndpoints(fakeBuilder()) as unknown as Record<string, Def>;
    const hubKeys = Object.keys(hubDatabase(fakeBuilder()));
    const apiKeys = Object.keys(apiDatabase(fakeBuilder()));
    expect(hubKeys.filter((k) => apiKeys.includes(k))).toEqual([]);

    // Each key in the flat map calls the same SDK method as its own factory's hook.
    const viaFactory = fakeNorbix();
    const own = {
      ...apiDatabase(fakeBuilder()),
      ...hubDatabase(fakeBuilder()),
    } as unknown as Record<string, Def>;
    const viaFlatMap = fakeNorbix();
    for (const key of [...apiKeys, ...hubKeys]) {
      await own[key].query({})(viaFactory.client);
      await all[key].query({})(viaFlatMap.client);
    }
    expect(viaFlatMap.calls).toEqual(viaFactory.calls);
    expect(viaFlatMap.calls.filter((c) => c.method.startsWith('hub.'))).toHaveLength(74);
  });
});

/**
 * Hub findRecords and insertRecord through the real `@norbix.ai/ts` client and
 * this package's base query, with a fake fetch — never a real server. Proves
 * the whole chain: verb, route with the collection substituted, project scope
 * headers, body, and a gateway error surfacing as the usual serialized error.
 */
describe('hub records through the real SDK (fake fetch)', () => {
  function run(key: string, args: unknown, status: number, body: unknown) {
    // Only globalThis.* here: the lint config declares no DOM globals.
    type FetchFn = typeof globalThis.fetch;
    const seen: Array<{
      url: string;
      method: string;
      body: unknown;
      headers: InstanceType<typeof globalThis.Headers>;
    }> = [];
    const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
      seen.push({
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
        body: init?.body ? JSON.parse(String(init.body)) : undefined,
        headers: new globalThis.Headers(init?.headers ?? {}),
      });
      return new globalThis.Response(JSON.stringify(body), {
        status,
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
    const endpoints = hubDatabase(fakeBuilder()) as unknown as Record<string, Def>;
    const baseQuery = createNorbixBaseQuery(() => norbix);
    const result = baseQuery(endpoints[key].query(args) as never, {} as never, {});
    return { seen, result };
  }

  it('findRecords sends GET /v2/database/collections/<name> with the project scope', async () => {
    const { seen, result } = run('findRecords', { collectionName: 'orders' }, 200, {
      result: '[{"_id":"r1"}]',
      totalCount: 1,
    });

    const out = (await result) as {
      data?: { result?: string; totalCount?: number };
      error?: unknown;
    };

    expect(out.error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0].method).toBe('GET');
    expect(seen[0].url.split('?')[0]).toBe('https://hub.norbix.io/v2/database/collections/orders');
    expect(seen[0].headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0].headers.get('X-CM-ProjectId')).toBe('test-project');
    expect(out.data).toEqual({ result: '[{"_id":"r1"}]', totalCount: 1 });
  });

  it('insertRecord sends POST with the document in the body', async () => {
    const { seen, result } = run(
      'insertRecord',
      { collectionName: 'orders', document: '{"total":5}' },
      200,
      { result: 'r2' },
    );

    const out = (await result) as { data?: { result?: string }; error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen[0].method).toBe('POST');
    expect(seen[0].url).toBe('https://hub.norbix.io/v2/database/collections/orders');
    expect(seen[0].body).toMatchObject({ document: '{"total":5}' });
    expect(out.data?.result).toBe('r2');
  });

  it('updateManyRecords sends PUT /many with allRecords for an empty filter', async () => {
    const { seen, result } = run(
      'updateManyRecords',
      { collectionName: 'orders', filter: '{}', update: '{"status":"archived"}', allRecords: true },
      200,
      { result: { matchedCount: 3, modifiedCount: 3 } },
    );

    const out = (await result) as { error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen[0].method).toBe('PUT');
    expect(seen[0].url).toBe('https://hub.norbix.io/v2/database/collections/orders/many');
    expect(seen[0].body).toMatchObject({ filter: '{}', allRecords: true });
  });

  it('deleteManyRecords sends DELETE /many with allRecords for an empty filter', async () => {
    const { seen, result } = run(
      'deleteManyRecords',
      { collectionName: 'orders', filter: '{}', allRecords: true },
      200,
      { result: { deletedCount: 3 } },
    );

    const out = (await result) as { error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen[0].method).toBe('DELETE');
    const url = new globalThis.URL(seen[0].url);
    expect(url.pathname).toBe('/v2/database/collections/orders/many');
    const sent = { ...Object.fromEntries(url.searchParams), ...(seen[0].body as object) };
    expect(String(sent.allRecords)).toBe('true');
  });

  it('a gateway error ResponseStatus comes back as the usual serialized error', async () => {
    const { result } = run('findRecords', { collectionName: 'orders' }, 403, {
      responseStatus: { errorCode: 'Forbidden', message: 'Missing permission database:read' },
    });

    const out = (await result) as { data?: unknown; error?: unknown };

    expect(out.data).toBeUndefined();
    expect(out.error).toMatchObject({
      status: 403,
      code: 'Forbidden',
      message: 'Missing permission database:read',
    });
  });
});
