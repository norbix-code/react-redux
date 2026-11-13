/* global Headers, Response, RequestInit */
import { Norbix } from '@norbix.ai/ts';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { apiAuth } from '../src/hooks/api/auth.js';
import { apiMembership } from '../src/hooks/api/membership.js';
import { NorbixProvider, useSocialSignInUrl } from '../src/provider.js';

/**
 * Social sign-in and link identity hooks drive the real `@norbix.ai/ts`
 * client with a fake fetch — never a real server — so each test pins the
 * exact verb, URL and body the hook sends.
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => def,
    mutation: (def: Record<string, unknown>) => def,
  } as never;
}

type Def = { query: (args: unknown) => (norbix: unknown) => unknown };

const auth = apiAuth(fakeBuilder()) as unknown as Record<string, Def>;
const membership = apiMembership(fakeBuilder()) as unknown as Record<string, Def>;

const tokenAnswer = {
  bearerToken: 'a.b.c',
  userId: 'usr_1',
  displayName: 'Anna',
  expiresAt: '2026-11-27T10:00:00Z',
  meta: { credentialVersion: 'v7' },
};

function client(body: unknown, config: Record<string, unknown> = {}) {
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
      apiVersion: 'v3',
      baseUrl: { api: 'https://api.test', hub: 'https://hub.test' },
      fetch: fetch as never,
      ...config,
    },
    { envSource: {} },
  );
  return { fetch, norbix, baseQuery: createNorbixBaseQuery(() => norbix) };
}

const run = (
  baseQuery: ReturnType<typeof createNorbixBaseQuery>,
  defs: Record<string, Def>,
  name: string,
  args?: unknown,
) => baseQuery(defs[name]!.query(args) as never, {} as never, {});

describe('useExchangeSocialCodeMutation', () => {
  it('POST /v3/membership/auth/social/{provider}/exchange { code }, and stores the JWT', async () => {
    const { fetch, norbix, baseQuery } = client(tokenAnswer);
    const result = await run(baseQuery, auth, 'exchangeSocialCode', {
      provider: 'google',
      code: 'one-time',
    });

    const [url, init] = fetch.mock.calls[0]!;
    expect(init?.method).toBe('POST');
    expect(url).toBe('https://api.test/v3/membership/auth/social/google/exchange');
    expect(JSON.parse(init?.body as string)).toEqual({ code: 'one-time' });
    expect(result).toMatchObject({ data: { bearerToken: 'a.b.c', userId: 'usr_1' } });
    expect(norbix.getConfig().bearerToken).toBe('a.b.c');
  });
});

describe('exchange sends no credentials', () => {
  it.each(['exchangeSocialCode', 'exchangeSocialSignInCode'])(
    '%s: no Authorization, though the client holds an old JWT',
    async (name) => {
      const { fetch, baseQuery } = client(tokenAnswer, { bearerToken: 'old.jwt' });
      const defs = name === 'exchangeSocialCode' ? auth : membership;
      await run(baseQuery, defs, name, { provider: 'google', code: 'one-time' });

      const [, init] = fetch.mock.calls[0]!;
      expect(new Headers(init?.headers).get('Authorization')).toBeNull();
    },
  );
});

describe('useCompleteSocialSignInMutation', () => {
  it('exchanges a sign-in code from the return page', async () => {
    const { fetch, baseQuery } = client(tokenAnswer);
    const result = await run(
      baseQuery,
      auth,
      'completeSocialSignIn',
      'https://app.test/cb?code=c1&provider=github',
    );
    expect(fetch.mock.calls[0]![0]).toBe(
      'https://api.test/v3/membership/auth/social/github/exchange',
    );
    expect(result).toMatchObject({ data: { kind: 'signedIn', provider: 'github' } });
  });

  it('hands a link code back without a request', async () => {
    const { fetch, baseQuery } = client(tokenAnswer);
    const result = await run(
      baseQuery,
      auth,
      'completeSocialSignIn',
      'https://app.test/cb?intent=link&code=c2&provider=google',
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual({ data: { kind: 'link', provider: 'google', code: 'c2' } });
  });
});

describe('link identity mutations', () => {
  it('startLinkIdentity: POST /v3/membership/auth/{UserId}/link-identity/start { provider, mode, returnUrl }', async () => {
    const { fetch, baseQuery } = client(
      { authorizeUrl: 'https://accounts.example/authorize' },
      { bearerToken: 'jwt-1' },
    );
    const result = await run(baseQuery, membership, 'startLinkIdentity', {
      userId: 'usr_1',
      provider: 'google',
      mode: 'app',
      returnUrl: 'https://app.test/settings',
    });

    const [url, init] = fetch.mock.calls[0]!;
    expect(init?.method).toBe('POST');
    expect(url).toBe('https://api.test/v3/membership/auth/usr_1/link-identity/start');
    expect(JSON.parse(init?.body as string)).toEqual({
      provider: 'google',
      mode: 'app',
      returnUrl: 'https://app.test/settings',
    });
    expect(result).toEqual({ data: { authorizeUrl: 'https://accounts.example/authorize' } });
  });

  it('finishLinkIdentity: POST /v3/membership/auth/{UserId}/link-identity { code }', async () => {
    const { fetch, baseQuery } = client({}, { bearerToken: 'jwt-1' });
    await run(baseQuery, membership, 'finishLinkIdentity', { userId: 'usr_1', code: 'link-code' });

    const [url, init] = fetch.mock.calls[0]!;
    expect(init?.method).toBe('POST');
    expect(url).toBe('https://api.test/v3/membership/auth/usr_1/link-identity');
    expect(JSON.parse(init?.body as string)).toEqual({ code: 'link-code' });
  });
});

describe('useSocialSignInUrl', () => {
  it('builds the start URL with the project id, mode and an encoded returnUrl', () => {
    const { norbix, fetch } = client({}, { env: 'TEST' });
    const { result } = renderHook(
      () =>
        useSocialSignInUrl('google', {
          mode: 'Admin portal & app',
          returnUrl: 'https://app.test/cb?x=1',
        }),
      {
        wrapper: ({ children }) => <NorbixProvider client={norbix}>{children}</NorbixProvider>,
      },
    );
    expect(result.current).toBe(
      'https://api.test/v3/membership/auth/social/google?projectId=pr_1&env=TEST' +
        '&mode=Admin%20portal%20%26%20app&returnUrl=https%3A%2F%2Fapp.test%2Fcb%3Fx%3D1',
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});
