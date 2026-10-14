import { Norbix } from '@norbix.ai/ts';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { apiPush } from '../src/hooks/api/push.js';
import { buildEndpoints } from '../src/hooks/index.js';
import { NorbixProvider, useNorbix } from '../src/provider.js';

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
  const calls: Array<{ method: string; args: unknown[] }> = [];
  const push = new Proxy(
    {},
    {
      get:
        (_t, method: string) =>
        (...args: unknown[]) => {
          calls.push({ method, args });
          return Promise.resolve({ ok: true });
        },
    },
  );
  return { client: { notifications: { push } }, calls };
}

describe('push hooks (notifications.push)', () => {
  const defs = apiPush(fakeBuilder()) as unknown as Record<string, Def>;

  it('ships every push endpoint, queries and mutations as expected', () => {
    expect(Object.keys(defs).sort()).toEqual([
      'listPushDevices',
      'listPushMessages',
      'markAllPushMessagesRead',
      'markPushMessageRead',
      'registerPushDevice',
      'removePushDevice',
      'removePushDeviceByToken',
    ]);
    expect(defs.listPushDevices!.__kind).toBe('query');
    expect(defs.listPushMessages!.__kind).toBe('query');
    expect(defs.registerPushDevice!.__kind).toBe('mutation');
    expect(defs.markAllPushMessagesRead!.__kind).toBe('mutation');
  });

  it('are part of the full endpoint set', () => {
    const all = buildEndpoints(fakeBuilder()) as unknown as Record<string, unknown>;
    expect(all.registerPushDevice).toBeDefined();
    expect(all.listPushMessages).toBeDefined();
  });

  it('call the matching SDK method with the hook argument', async () => {
    const { client, calls } = fakeNorbix();
    const device = { provider: 'expo', token: 't1', platform: 'ios' };
    await defs.registerPushDevice!.query(device)(client);
    await defs.listPushDevices!.query(undefined)(client);
    await defs.removePushDevice!.query('pnd_1')(client);
    await defs.removePushDeviceByToken!.query('t1')(client);
    await defs.listPushMessages!.query({ unreadOnly: true })(client);
    await defs.listPushMessages!.query(undefined)(client);
    await defs.markPushMessageRead!.query('m1')(client);
    await defs.markAllPushMessagesRead!.query(undefined)(client);
    expect(calls).toEqual([
      { method: 'registerDevice', args: [device] },
      { method: 'listDevices', args: [] },
      { method: 'removeDevice', args: ['pnd_1'] },
      { method: 'removeDeviceByToken', args: ['t1'] },
      { method: 'listMessages', args: [{ unreadOnly: true }] },
      { method: 'listMessages', args: [{}] },
      { method: 'markMessageRead', args: ['m1'] },
      { method: 'markAllMessagesRead', args: [] },
    ]);
  });

  it('device writes invalidate PushDevices, message writes PushMessages', () => {
    expect(defs.listPushDevices!.providesTags).toEqual(['PushDevices']);
    expect(defs.registerPushDevice!.invalidatesTags).toEqual(['PushDevices']);
    expect(defs.removePushDeviceByToken!.invalidatesTags).toEqual(['PushDevices']);
    expect(defs.listPushMessages!.providesTags).toEqual(['PushMessages']);
    expect(defs.markPushMessageRead!.invalidatesTags).toEqual(['PushMessages']);
    expect(defs.markAllPushMessagesRead!.invalidatesTags).toEqual(['PushMessages']);
  });

  it('reach the real SDK routes', async () => {
    const fetchImpl = vi.fn(
      async () => new globalThis.Response('{}', { status: 200 }),
    ) as unknown as typeof globalThis.fetch;
    const norbix = new Norbix({
      projectId: 'p1',
      bearerToken: 'jwt',
      apiVersion: 'v3',
      baseUrl: { api: 'https://api.example.test', hub: 'https://hub.example.test' },
      fetch: fetchImpl,
    });
    await defs.markAllPushMessagesRead!.query(undefined)(norbix);
    const [url, init] = (
      fetchImpl as unknown as { mock: { calls: [string, { method?: string }][] } }
    ).mock.calls[0]!;
    expect(url).toBe('https://api.example.test/v3/notifications/push/messages/read');
    expect(init.method).toBe('POST');
  });
});

describe('<NorbixProvider language>', () => {
  function client() {
    return new Norbix(
      { projectId: 'p1', apiKey: 'k', fetch: vi.fn() as unknown as typeof globalThis.fetch },
      { envSource: {} },
    );
  }

  it('sets the client language so every hook request sends Accept-Language', () => {
    const norbix = client();
    renderHook(() => useNorbix(), {
      wrapper: ({ children }) => (
        <NorbixProvider client={norbix} language="lt-LT, en;q=0.8">
          {children}
        </NorbixProvider>
      ),
    });
    expect(norbix.getLanguage()).toBe('lt-LT, en;q=0.8');
  });

  it('leaves the client language alone when the prop is omitted', () => {
    const norbix = client();
    norbix.setLanguage('de');
    renderHook(() => useNorbix(), {
      wrapper: ({ children }) => <NorbixProvider client={norbix}>{children}</NorbixProvider>,
    });
    expect(norbix.getLanguage()).toBe('de');
  });
});
