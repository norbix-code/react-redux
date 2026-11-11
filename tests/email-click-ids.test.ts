import { describe, expect, it } from 'vitest';

import { hubNotifications } from '../src/hooks/hub/notifications.js';

/**
 * Email click ids (core SDK 4.56.0): the switch and the click import. Both are
 * mutations, 1:1 with `norbix.hub.notifications`, and each invalidates the
 * cache that holds what it changes.
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
  invalidatesTags?: unknown;
};

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({});
  };
  const names = ['updateEmailClickTracking', 'recordEmailClicks'];
  const notifications = Object.fromEntries(names.map((n) => [n, record(n)]));
  return { calls, client: { hub: { notifications } } };
}

const endpoints = hubNotifications(fakeBuilder()) as unknown as Record<string, Def>;

describe('hubNotifications — email click ids', () => {
  it.each([
    ['updateEmailClickTracking', { enabled: true }, ['Projects']],
    [
      'recordEmailClicks',
      { clicks: [{ nblid: 'ntf_1.3.v1.Ab12Cd34Ef56Gh78', url: 'https://shop.example.com/' }] },
      ['EmailCampaigns'],
    ],
  ])('%s is a mutation that reaches the SDK method unchanged', async (key, args, tags) => {
    const { calls, client } = fakeNorbix();

    await endpoints[key]!.query(args)(client);

    expect(calls).toEqual([{ method: key, args }]);
    expect(endpoints[key]!.__kind).toBe('mutation');
    expect(endpoints[key]!.invalidatesTags).toEqual(tags);
  });
});
