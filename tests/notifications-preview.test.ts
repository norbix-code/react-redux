import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { hubNotifications } from '../src/hooks/hub/notifications.js';

/**
 * The notification preview hooks — push, email and sms.
 *
 * The gateway opens `GET /{version}/notifications/{push|email|sms}/preview`
 * without sign-in when `hash` is a valid signed link. The hooks are a 1:1
 * wrapper over the core SDK, so the contract here is: the hook reaches the
 * right SDK method with the caller's `hash`, unchanged. Whether a client with
 * no token may send it is decided by `@norbix.ai/ts` (its `'optional'` scope),
 * not by these hooks.
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
};

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ title: 'Hi' });
  };
  const names = ['previewPushNotification', 'previewEmailNotification', 'previewSmsNotification'];
  const notifications = Object.fromEntries(names.map((n) => [n, record(n)]));
  return { calls, client: { hub: { notifications } } };
}

const endpoints = hubNotifications(fakeBuilder()) as unknown as Record<string, Def>;

describe('hubNotifications — preview with a signed link', () => {
  it.each([
    ['previewPushNotification', ['Push']],
    ['previewEmailNotification', ['Emails']],
    ['previewSmsNotification', ['Sms']],
  ])('%s passes hash through to the SDK method unchanged', async (key, tags) => {
    const { calls, client } = fakeNorbix();
    const args = { hash: 'abc.def' };

    await endpoints[key]!.query(args)(client);

    expect(calls).toEqual([{ method: key, args: { hash: 'abc.def' } }]);
    expect(endpoints[key]!.__kind).toBe('query');
    expect(endpoints[key]!.providesTags).toEqual(tags);
  });

  it('previewPushNotification sends hash in the query string through the real SDK', async () => {
    const urls: string[] = [];
    // Only globalThis.* here: the lint config declares no DOM globals.
    const fetchImpl = vi.fn(async (input: unknown) => {
      urls.push(String(input));
      return new globalThis.Response(JSON.stringify({ title: 'Hi' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as typeof globalThis.fetch;
    const norbix = new Norbix(
      {
        projectId: 'p-1',
        bearerToken: 'session',
        hubVersion: 'v2',
        baseUrl: { api: 'https://api.norbix.io', hub: 'https://hub.norbix.io' },
        fetch: fetchImpl,
      },
      { envSource: {} },
    );

    await endpoints.previewPushNotification!.query({ hash: 'abc.def' })(norbix);

    expect(urls).toEqual(['https://hub.norbix.io/v2/notifications/push/preview?hash=abc.def']);
  });
});
