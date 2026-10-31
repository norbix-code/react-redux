/* global Response, RequestInit */
import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { apiAuth } from '../src/hooks/api/auth.js';

/**
 * Cookie-session hooks. `signIn` and `signOut` drive the real `@norbix.ai/ts`
 * client with a fake fetch — never a real server — because the point is what a
 * `browserSession` client really does, and that `logout` stays local.
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => def,
    mutation: (def: Record<string, unknown>) => def,
  } as never;
}

type Def = { query: (args: unknown) => (norbix: unknown) => unknown; invalidatesTags: unknown };

const endpoints = apiAuth(fakeBuilder()) as unknown as Record<string, Def>;

const SESSION = 'Jorj9XCD0MRB2tNlhvI7';

function browserClient(body: unknown, auth: unknown = { type: 'browserSession' }) {
  const fetch = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(
    async () =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  );
  const norbix = new Norbix(
    {
      projectId: 'pr_1',
      baseUrl: { api: 'https://api.test', hub: 'https://hub.test' },
      fetch: fetch as never,
      auth: auth as never,
    },
    { envSource: {} },
  );
  return { fetch, baseQuery: createNorbixBaseQuery(() => norbix) };
}

const run = (baseQuery: ReturnType<typeof createNorbixBaseQuery>, name: string, args?: unknown) =>
  baseQuery(endpoints[name]!.query(args) as never, {} as never, {});

describe('useSignInMutation', () => {
  it('signs in on a browserSession client, with credentials and no JWT', async () => {
    const { fetch, baseQuery } = browserClient({ userId: 'usr_1', displayName: 'Anna' });
    const result = await run(baseQuery, 'signIn', { userName: 'anna', password: 'pw' });

    expect(result).toEqual({ data: { userId: 'usr_1', displayName: 'Anna' } });
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe('https://api.test/v3/auth');
    expect(init?.credentials).toBe('include');
    expect(JSON.parse(init?.body as string).meta).toEqual({ ignore: 'jwt' });
  });

  it('keeps a session id and a JWT out of the Redux store', async () => {
    const { baseQuery } = browserClient({
      userId: 'usr_1',
      sessionId: SESSION,
      bearerToken: 'a.b.c',
    });
    const result = await run(baseQuery, 'signIn', { userName: 'anna', password: 'pw' });

    expect(JSON.stringify(result)).not.toContain(SESSION);
    expect(JSON.stringify(result)).not.toContain('a.b.c');
  });

  it('a client that is not browserSession gets an error, not a request', async () => {
    const { fetch, baseQuery } = browserClient({}, { type: 'none' });
    const result = await run(baseQuery, 'signIn', { userName: 'a', password: 'b' });

    expect(result).toMatchObject({ error: { code: 'NORBIX_AUTH_CONFIG' } });
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe('useSignOutMutation', () => {
  it('ends the session on the server', async () => {
    const { fetch, baseQuery } = browserClient({});
    await run(baseQuery, 'signOut');

    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe('https://api.test/v3/auth/logout');
    expect(init?.method).toBe('POST');
    expect(init?.credentials).toBe('include');
  });

  it('clears the same cache as logout, which stays local', async () => {
    expect(endpoints['signOut']!.invalidatesTags).toEqual(endpoints['logout']!.invalidatesTags);
    expect(endpoints['logout']!.query).toBeUndefined();
  });
});
