import { describe, expect, it } from 'vitest';

import { hubPayments } from '../src/hooks/hub/payments.js';

/**
 * `hub.payments` hooks (gateway campaign audit/payments, item 8). Same fake
 * builder and fake client as the files tests: the hooks are a 1:1 wrapper of
 * the core SDK, so "it reached the right SDK method with my arguments" and the
 * cache tags are the whole contract.
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
  const payments = new Proxy(
    {},
    {
      get: (_t, name: string) => (args: unknown) => {
        calls.push({ method: `hub.${name}`, args });
        return Promise.resolve({ ok: true });
      },
    },
  );
  return { calls, client: { hub: { payments } } };
}

describe('hubPayments', () => {
  const endpoints = hubPayments(fakeBuilder()) as unknown as Record<string, Def>;

  it('covers all 17 hub Payments endpoints of the core SDK', () => {
    expect(Object.keys(endpoints)).toHaveLength(17);
    expect(endpoints).toHaveProperty('getPaymentsWebhookLog');
  });

  it('getPaymentsWebhookLog is a query that reaches the SDK method with the caller args', async () => {
    const { calls, client } = fakeNorbix();
    const args = { integrationId: 'int_stripe', limit: 20 };

    await endpoints.getPaymentsWebhookLog.query(args)(client);

    expect(endpoints.getPaymentsWebhookLog.__kind).toBe('query');
    expect(endpoints.getPaymentsWebhookLog.providesTags).toEqual(['PaymentIntegrations']);
    expect(calls).toEqual([{ method: 'hub.getPaymentsWebhookLog', args }]);
  });
});
