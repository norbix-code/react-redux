import { Norbix } from '@norbix.ai/ts';
import type { CodeMashHub2 } from '@norbix.ai/ts/types/hub';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubNotifications } from '../src/hooks/hub/notifications.js';
import type { Result } from '../src/hooks/types.js';

/**
 * Template clone answers with the new copy's id (gateway 2026-10-23,
 * @norbix.ai/ts 4.37.0: `IdResponse`, was `EmptyResponse`). The clone hooks
 * hand that answer to the caller in `data`, so the dashboard can open the copy
 * right away. Driven through the real `@norbix.ai/ts` client and this
 * package's base query with a fake fetch — never a real server.
 */
type Def = { query: (args: unknown) => (norbix: unknown) => unknown };

function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => def,
    mutation: (def: Record<string, unknown>) => def,
  } as never;
}

const endpoints = hubNotifications(fakeBuilder()) as unknown as Record<string, Def>;

type Notifications = Norbix['hub']['notifications'];

function run(key: string, args: unknown, answer: unknown) {
  type FetchFn = typeof globalThis.fetch;
  const seen: Array<{ url: string; method: string }> = [];
  const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
    seen.push({ url: String(input), method: (init?.method ?? 'GET').toUpperCase() });
    return new globalThis.Response(JSON.stringify(answer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as FetchFn;
  const norbix = new Norbix({
    bearerToken: 'test-token',
    projectId: 'test-project',
    hubVersion: 'v2',
    baseUrl: { api: 'https://api.norbix.io', hub: 'https://hub.norbix.io' },
    fetch: fetchImpl,
  });
  const baseQuery = createNorbixBaseQuery(() => norbix);
  const result = baseQuery(endpoints[key]!.query(args) as never, {} as never, {});
  return { seen, result };
}

describe('template clone hooks return the new copy id', () => {
  it('the clone hooks are typed with the id answer', () => {
    expectTypeOf<
      Result<Notifications['cloneEmailTemplate']>
    >().toEqualTypeOf<CodeMashHub2.IdResponse>();
    expectTypeOf<
      Result<Notifications['cloneSmsTemplate']>
    >().toEqualTypeOf<CodeMashHub2.IdResponse>();
    expectTypeOf<
      Result<Notifications['clonePushTemplate']>
    >().toEqualTypeOf<CodeMashHub2.IdResponse>();
  });

  it.each([
    ['cloneEmailTemplate', 'email'],
    ['cloneSmsTemplate', 'sms'],
    ['clonePushTemplate', 'push'],
  ])('%s puts the copy id in data', async (key, channel) => {
    const { seen, result } = run(key, { id: 'tpl_1' }, { id: `${channel}_copy` });

    const out = (await result) as { data?: CodeMashHub2.IdResponse; error?: unknown };

    expect(out.error).toBeUndefined();
    expect(seen).toEqual([
      {
        method: 'POST',
        url: `https://hub.norbix.io/v2/notifications/${channel}/templates/tpl_1/clone`,
      },
    ]);
    expect(out.data?.id).toBe(`${channel}_copy`);
  });
});
