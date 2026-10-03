import { describe, expect, it } from 'vitest';

import { apiPublic } from '../src/hooks/api/public.js';
import { hubAccount } from '../src/hooks/hub/account.js';

/**
 * Project module (settings, CORS, languages, regions, admin portal, legal,
 * AI settings, AI service users, public config). The hooks are a 1:1 wrapper,
 * so the contract is: the right SDK method, my arguments, query vs mutation,
 * and the cache tag. No HTTP, no provider.
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
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
  };
  const mod = (prefix: string, names: readonly string[]) =>
    Object.fromEntries(names.map((n) => [n, record(`${prefix}.${n}`)]));
  return {
    calls,
    client: {
      hub: { account: mod('hub.account', [...PROJECT_QUERIES, ...PROJECT_MUTATIONS]) },
      api: { public: mod('api.public', PUBLIC) },
    },
  };
}

const PROJECT_QUERIES = [
  'getProject',
  'getProjects',
  'getProjectTokens',
  'getProjectAiSettings',
  'getProjectAiUsage',
  'getAdminPortalStructure',
  'listAiServiceUsers',
] as const;

const PROJECT_MUTATIONS = [
  'createProject',
  'deleteProject',
  'enableProject',
  'disableProject',
  'updateProjectName',
  'updateProjectDescription',
  'updateProjectUrl',
  'updateProjectLogo',
  'updateProjectIcon',
  'updateProjectMainColor',
  'updateProjectAccentColor',
  'updateProjectAllowedOrigins',
  'updateProjectLanguages',
  'updateProjectDefaultLanguage',
  'updateProjectRegions',
  'updateProjectAdminUrl',
  'updateProjectLegalDocuments',
  'updateProjectExposeLegal',
  'setAdminPortalEnabled',
  'assignAdminPortalServiceUser',
  'updateProjectAiSettings',
  'createProjectAiAssistant',
  'updateProjectAiAssistant',
  'deleteProjectAiAssistant',
  'createAiServiceUser',
  'deleteAiServiceUser',
  'rotateAiServiceUserKey',
  'revokeAiServiceUserKey',
] as const;

const PUBLIC = ['getPublicProjectConfig', 'getPublicProjectLegal'] as const;

/** Tags a query provides, given its argument. */
function tagsOf(def: Def, arg: unknown): unknown {
  const t = def.__kind === 'query' ? def.providesTags : def.invalidatesTags;
  return typeof t === 'function'
    ? (t as (...a: unknown[]) => unknown)(undefined, undefined, arg)
    : t;
}

describe('Project hooks — hub.account', () => {
  const defs = hubAccount(fakeBuilder()) as unknown as Record<string, Def>;

  it.each(PROJECT_QUERIES.map((n) => [n]))('%s is a query that provides Projects', async (name) => {
    const { calls, client } = fakeNorbix();
    const def = defs[name]!;
    expect(def.__kind).toBe('query');
    expect(def.providesTags).toEqual(['Projects']);
    const args = { id: 'project-1', probe: name };
    await def.query(args)(client);
    expect(calls).toEqual([{ method: `hub.account.${name}`, args }]);
  });

  it.each(PROJECT_MUTATIONS.map((n) => [n]))(
    '%s is a mutation that invalidates Projects',
    async (name) => {
      const { calls, client } = fakeNorbix();
      const def = defs[name]!;
      expect(def.__kind).toBe('mutation');
      expect(def.invalidatesTags).toEqual(['Projects']);
      const args = { id: 'project-1', probe: name };
      await def.query(args)(client);
      expect(calls).toEqual([{ method: `hub.account.${name}`, args }]);
    },
  );

  it('does not wrap the JSON-RPC mcp endpoint', () => {
    expect(defs['mcp']).toBeUndefined();
  });
});

describe('Project hooks — api.public (Admin Portal, no sign-in)', () => {
  const defs = apiPublic(fakeBuilder()) as unknown as Record<string, Def>;

  it('getPublicProjectConfig is a query cached under Config/PUBLIC', async () => {
    const { calls, client } = fakeNorbix();
    const def = defs['getPublicProjectConfig']!;
    expect(def.__kind).toBe('query');
    expect(tagsOf(def, {})).toEqual([{ type: 'Config', id: 'PUBLIC' }]);
    await def.query({})(client);
    expect(calls).toEqual([{ method: 'api.public.getPublicProjectConfig', args: {} }]);
  });

  it('getPublicProjectLegal is a query cached per document kind', async () => {
    const { calls, client } = fakeNorbix();
    const def = defs['getPublicProjectLegal']!;
    expect(def.__kind).toBe('query');
    expect(tagsOf(def, { kind: 'privacy' })).toEqual([{ type: 'Config', id: 'LEGAL:privacy' }]);
    expect(tagsOf(def, undefined)).toEqual([{ type: 'Config', id: 'LEGAL:unknown' }]);
    await def.query({ kind: 'terms' })(client);
    expect(calls).toEqual([
      { method: 'api.public.getPublicProjectLegal', args: { kind: 'terms' } },
    ]);
  });
});
