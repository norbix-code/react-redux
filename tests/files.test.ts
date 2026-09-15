import { describe, expect, it } from 'vitest';

import { apiFiles } from '../src/hooks/api/files.js';
import { hubFiles } from '../src/hooks/hub/files.js';

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

  it('covers all 9 api Files endpoints of the core SDK', () => {
    expect(Object.keys(endpoints).sort()).toEqual(
      [
        'commitUpload', 'deleteFileApi', 'deleteManyFilesApi', 'downloadFileApi',
        'getFileInfo', 'getSignedUrl', 'listFiles', 'requestUploadUrl', 'getPublicFile',
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
