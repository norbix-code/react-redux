import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubAccount } from '../src/hooks/hub/account.js';

/**
 * "Me" hooks — `GET /account/me` and `PUT /account/me/phone` (core SDK 4.8.0).
 * The signed-in owner or team member reads their own profile and sets the
 * phone that "Account users" SMS campaigns send to. The hooks are a 1:1
 * wrapper, so the contract is: the right SDK method with my arguments, query
 * vs mutation, and the cache tag. The last describe drives the real
 * `@norbix.ai/ts` client with a fake fetch — never a real server.
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

const ME: Record<string, ['query' | 'mutation', string]> = {
  getMyAccountUserProfile: ['query', 'providesTags'],
  updateMyAccountUserPhone: ['mutation', 'invalidatesTags'],
};
const NAMES = Object.keys(ME);

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

describe('hubAccount — me (own profile and phone)', () => {
  it('ships both "me" hooks', () => {
    for (const key of NAMES) expect(endpoints[key]).toBeDefined();
  });

  it.each(NAMES)('%s reaches the matching SDK method with the caller args', async (key) => {
    const { calls, client } = fakeNorbix();
    const args = key === 'updateMyAccountUserPhone' ? { phone: '+37060000000' } : {};

    await endpoints[key]!.query(args)(client);

    expect(calls).toEqual([{ method: key, args }]);
  });

  it.each(NAMES)('%s is a %s', (key) => {
    expect(endpoints[key]!.__kind).toBe(ME[key]![0]);
  });

  it('the profile provides Account; the phone change invalidates Account (profile and team list re-read)', () => {
    expect(endpoints['getMyAccountUserProfile']!.providesTags).toEqual(['Account']);
    expect(endpoints['updateMyAccountUserPhone']!.invalidatesTags).toEqual(['Account']);
    // The team list shares the tag, so a new phone shows there without a manual refetch.
    expect(endpoints['getAccountCollaborators']!.providesTags).toEqual(['Account']);
  });
});

describe('"me" hooks through the real SDK (fake fetch)', () => {
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

  it('getMyAccountUserProfile sends GET /v2/account/me and returns the profile', async () => {
    const item = { id: 'usr_1', email: 'ada@example.com', phone: '+37060000000' };
    const { seen, result } = run('getMyAccountUserProfile', undefined, { item });
    const out = (await result) as { data?: { item?: unknown }; error?: unknown };
    expect(out.error).toBeUndefined();
    expect(out.data?.item).toEqual(item);
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe('GET');
    expect(seen[0]!.url).toBe(`${HUB}/account/me`);
    expect(seen[0]!.body).toBeUndefined();
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it.each([
    ['sets', '+37060000000'],
    ['clears', ''],
  ])(
    'updateMyAccountUserPhone %s the phone with PUT /v2/account/me/phone and the phone in the JSON body',
    async (_what, phone) => {
      const { seen, result } = run('updateMyAccountUserPhone', { phone });
      expect(((await result) as { error?: unknown }).error).toBeUndefined();
      expect(seen).toHaveLength(1);
      expect(seen[0]!.method).toBe('PUT');
      expect(seen[0]!.url).toBe(`${HUB}/account/me/phone`);
      expect(JSON.parse(seen[0]!.body!)).toEqual({ phone });
    },
  );
});
