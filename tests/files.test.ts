import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { apiFiles } from '../src/hooks/api/files.js';
import { hubFiles } from '../src/hooks/hub/files.js';
import { buildEndpoints } from '../src/hooks/index.js';

/**
 * Same fake builder the integrations tests use: RTK Query's real builder is
 * internally complex, and what we need to check here is the shape of the
 * definitions and what each one does with the client.
 */
function fakeBuilder() {
  const kinds: Record<string, 'query' | 'mutation'> = {};
  const builder = {
    query: (def: Record<string, unknown>) => ({ ...def, __kind: 'query' }),
    mutation: (def: Record<string, unknown>) => ({ ...def, __kind: 'mutation' }),
  } as never;
  return { builder, kinds };
}

type Def = {
  __kind: 'query' | 'mutation';
  query: (args: unknown) => (norbix: unknown) => unknown;
  providesTags?: unknown;
  invalidatesTags?: unknown;
};

/**
 * Fake transport: a stand-in Norbix client that records which SDK method was
 * called and with what. No HTTP, no server — the hooks are a 1:1 wrapper, so
 * "it reached the right SDK method with my arguments" is the whole contract.
 */
function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record =
    (method: string) =>
    (args: unknown) => {
      calls.push({ method, args });
      return Promise.resolve({ ok: true });
    };
  const names = [
    'disableFiles', 'enableFiles', 'deleteFilesTrigger', 'disableFilesTrigger',
    'enableFilesTrigger', 'getFilesTrigger', 'getFilesTriggers', 'saveFilesTrigger',
    'deleteFilesIntegration', 'disableFilesIntegration', 'enableFilesIntegration',
    'getFilesIntegration', 'getFilesIntegrations', 'saveFilesIntegration',
    'setFilesIntegrationAsDefault', 'getFile', 'getFolderFiles',
    'testFilesIntegration', 'makeFilePublic', 'makeFilePrivate',
    'makeFolderPublic', 'makeFolderPrivate',
  ];
  const apiNames = [
    'commitUpload', 'deleteFileApi', 'deleteManyFilesApi', 'downloadFileApi',
    'getFileInfo', 'getSignedUrl', 'listFiles', 'requestUploadUrl', 'getPublicFile',
    'testFilesIntegration',
  ];
  const hub = Object.fromEntries(names.map((n) => [n, record(`hub.${n}`)]));
  const api = Object.fromEntries(apiNames.map((n) => [n, record(`api.${n}`)]));
  return { calls, client: { hub: { files: hub }, api: { files: api } } };
}

describe('hubFiles', () => {
  const endpoints = hubFiles(fakeBuilder().builder) as unknown as Record<string, Def>;

  it('covers all 22 hub Files endpoints of the core SDK', () => {
    expect(Object.keys(endpoints).sort()).toEqual(
      [
        'disableFiles', 'enableFiles', 'deleteFilesTrigger', 'disableFilesTrigger',
        'enableFilesTrigger', 'getFilesTrigger', 'getFilesTriggers', 'saveFilesTrigger',
        'deleteFilesIntegration', 'disableFilesIntegration', 'enableFilesIntegration',
        'getFilesIntegration', 'getFilesIntegrations', 'saveFilesIntegration',
        'setFilesIntegrationAsDefault', 'getFile', 'getFolderFiles',
        'testFilesIntegration', 'makeFilePublic', 'makeFilePrivate',
        'makeFolderPublic', 'makeFolderPrivate',
      ].sort(),
    );
  });

  it.each([
    ['testFilesIntegration', 'hub.testFilesIntegration'],
    ['makeFilePublic', 'hub.makeFilePublic'],
    ['makeFilePrivate', 'hub.makeFilePrivate'],
    ['makeFolderPublic', 'hub.makeFolderPublic'],
    ['makeFolderPrivate', 'hub.makeFolderPrivate'],
  ])('%s reaches the matching SDK method with the caller args', async (key, method) => {
    const { calls, client } = fakeNorbix();
    const args = { filesIntegrationId: 'nbin_1', path: 'docs/a.pdf' };

    await endpoints[key].query(args)(client);

    expect(calls).toEqual([{ method, args }]);
  });

  it('the four publish calls are mutations that invalidate Files', () => {
    for (const key of ['makeFilePublic', 'makeFilePrivate', 'makeFolderPublic', 'makeFolderPrivate']) {
      expect(endpoints[key].__kind).toBe('mutation');
      expect(endpoints[key].invalidatesTags).toEqual(['Files']);
    }
  });

  it('testFilesIntegration is a mutation and invalidates nothing', () => {
    // It saves nothing on the server, so nothing in the cache is stale;
    // it is a mutation only so its answer is never served from cache.
    expect(endpoints.testFilesIntegration.__kind).toBe('mutation');
    expect(endpoints.testFilesIntegration.invalidatesTags).toBeUndefined();
  });
});

describe('apiFiles', () => {
  const endpoints = apiFiles(fakeBuilder().builder) as unknown as Record<string, Def>;

  it('covers all 10 api Files endpoints of the core SDK', () => {
    expect(Object.keys(endpoints).sort()).toEqual(
      [
        'commitUpload', 'deleteFileApi', 'deleteManyFilesApi', 'downloadFileApi',
        'getFileInfo', 'getSignedUrl', 'listFiles', 'requestUploadUrl', 'getPublicFile',
        // api.files.testFilesIntegration — suffixed, see the next describe.
        'testFilesIntegrationApi',
      ].sort(),
    );
  });

  it('getPublicFile reaches the SDK method with the caller args', async () => {
    const { calls, client } = fakeNorbix();
    const args = { publicId: 'nbpf_abc', name: '2026/q1/report.pdf' };

    await endpoints.getPublicFile.query(args)(client);

    expect(calls).toEqual([{ method: 'api.getPublicFile', args }]);
  });

  it('getPublicFile is a query cached per public id', () => {
    expect(endpoints.getPublicFile.__kind).toBe('query');
    const provides = endpoints.getPublicFile.providesTags as (
      r: unknown,
      e: unknown,
      arg: { publicId?: string },
    ) => unknown;

    expect(provides(undefined, undefined, { publicId: 'nbpf_abc' })).toEqual([
      { type: 'Files', id: 'PUBLIC:nbpf_abc' },
    ]);
    // Two different links must not share one cache entry.
    expect(provides(undefined, undefined, { publicId: 'nbpf_other' })).toEqual([
      { type: 'Files', id: 'PUBLIC:nbpf_other' },
    ]);
  });
});

/**
 * `api.files.testFilesIntegration` — POST /{version}/files/{filesIntegrationId}/test
 * (10b-files slice API-TEST, #39). Not the Hub endpoint of the same SDK name.
 */
describe('apiFiles.testFilesIntegrationApi', () => {
  const endpoints = apiFiles(fakeBuilder().builder) as unknown as Record<string, Def>;

  it('reaches api.files.testFilesIntegration with the caller args', async () => {
    const { calls, client } = fakeNorbix();
    const args = { filesIntegrationId: 'nbin_1' };

    await endpoints.testFilesIntegrationApi.query(args)(client);

    expect(calls).toEqual([{ method: 'api.testFilesIntegration', args }]);
  });

  it('is a mutation that invalidates Files and FilesIntegrations', () => {
    // Files: the probe uploads and deletes a real file (a failed delete
    // leaves it behind). FilesIntegrations: the gateway records the test
    // outcome on the integration, which getFilesIntegration(s) return.
    expect(endpoints.testFilesIntegrationApi.__kind).toBe('mutation');
    expect(endpoints.testFilesIntegrationApi.invalidatesTags).toEqual([
      'Files',
      'FilesIntegrations',
    ]);
  });

  it('is not shadowed by, and does not shadow, the Hub testFilesIntegration', async () => {
    // buildEndpoints spreads every factory into ONE flat map, Hub after Api,
    // so an Api key equal to a Hub key would be silently replaced.
    const all = buildEndpoints(fakeBuilder().builder as never) as unknown as Record<string, Def>;
    const { calls, client } = fakeNorbix();

    await all.testFilesIntegrationApi.query({ filesIntegrationId: 'nbin_1' })(client);
    await all.testFilesIntegration.query({ integrationId: 'nbin_1' })(client);

    expect(calls.map((c) => c.method)).toEqual([
      'api.testFilesIntegration',
      'hub.testFilesIntegration',
    ]);
  });
});

/**
 * The same hook driven through the real `@norbix.ai/ts` client and this
 * package's base query, with a fake fetch — never a real server. Proves the
 * whole chain: verb, route with the id substituted, project scope headers,
 * items parsed into `data`, and a gateway error surfacing as the usual
 * serialized error in `error`.
 */
describe('testFilesIntegrationApi through the real SDK (fake fetch)', () => {
  const HAPPY_BODY = {
    items: [
      { operation: 'UploadFile', result: 'OK' },
      { operation: 'GetFile', result: 'OK' },
      { operation: 'GetAllFiles', result: 'OK' },
      { operation: 'DeleteFile', result: 'OK' },
    ],
    responseStatus: { isSuccess: true },
  };

  function run(status: number, body: unknown) {
    // Only globalThis.* here: the lint config declares no DOM globals.
    type FetchFn = typeof globalThis.fetch;
    const seen: Array<{
      url: string;
      method: string;
      headers: InstanceType<typeof globalThis.Headers>;
    }> = [];
    const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
      seen.push({
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
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
    const endpoints = apiFiles(fakeBuilder().builder) as unknown as Record<string, Def>;
    const baseQuery = createNorbixBaseQuery(() => norbix);
    const call = endpoints.testFilesIntegrationApi.query({ filesIntegrationId: 'int_42' });
    const result = baseQuery(call as never, {} as never, {});
    return { seen, result };
  }

  it('sends POST /v2/files/<id>/test with the project scope and parses the items', async () => {
    const { seen, result } = run(200, HAPPY_BODY);

    const out = (await result) as { data?: typeof HAPPY_BODY; error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0].method).toBe('POST');
    expect(seen[0].url).toBe('https://api.norbix.io/v2/files/int_42/test');
    expect(seen[0].headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0].headers.get('X-CM-ProjectId')).toBe('test-project');
    expect(out.data?.items.map((i) => `${i.operation}:${i.result}`)).toEqual([
      'UploadFile:OK',
      'GetFile:OK',
      'GetAllFiles:OK',
      'DeleteFile:OK',
    ]);
  });

  it('a gateway error ResponseStatus comes back as the usual serialized error', async () => {
    const { result } = run(403, {
      responseStatus: { errorCode: 'Forbidden', message: 'Missing permission files:create' },
    });

    const out = (await result) as { data?: unknown; error?: unknown };

    expect(out.data).toBeUndefined();
    expect(out.error).toMatchObject({
      status: 403,
      code: 'Forbidden',
      message: 'Missing permission files:create',
    });
  });
});
