import { describe, expect, it } from 'vitest';

import { apiPayments } from '../src/hooks/api/payments.js';
import { hubPayments } from '../src/hooks/hub/payments.js';
import { buildEndpoints } from '../src/hooks/index.js';

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

type TagFn = (res: unknown, err: unknown, arg: unknown) => unknown;

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
  const apiPaymentsClient = new Proxy(
    {},
    {
      get: (_t, name: string) => (args: unknown) => {
        calls.push({ method: `api.${name}`, args });
        return Promise.resolve({ ok: true });
      },
    },
  );
  return { calls, client: { hub: { payments }, api: { payments: apiPaymentsClient } } };
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

/**
 * `api.payments` hooks — payment orders + checkout (campaign
 * audit/payments-checkout, item sdk-all; core SDK 4.29.0).
 */
describe('apiPayments', () => {
  const endpoints = apiPayments(fakeBuilder()) as unknown as Record<string, Def>;

  it('covers the 4 api Payments endpoints of the core SDK', () => {
    expect(Object.keys(endpoints).sort()).toEqual(
      ['createPaymentOrder', 'getPaymentOrder', 'getPaymentOrders', 'startPaymentCheckout'].sort(),
    );
  });

  it.each([
    [
      'createPaymentOrder',
      'mutation',
      {
        buyerUserId: 'usr_1',
        merchantReference: 'listing-42',
        idempotencyKey: 'listing-42-key',
        currency: 'EUR',
        priceVersion: 'v1',
        lines: [{ sku: 'promo', quantity: 21, unitAmountMinor: 30 }],
      },
    ],
    ['getPaymentOrder', 'query', { id: 'ord_1' }],
    ['getPaymentOrders', 'query', { buyerUserId: 'usr_1', status: 'Paid' }],
    [
      'startPaymentCheckout',
      'mutation',
      { id: 'ord_1', integrationId: 'int_montonio', returnUrl: 'https://shop.example/return' },
    ],
  ])('%s is a %s that reaches api.payments.%s with the caller args', async (key, kind, args) => {
    const { calls, client } = fakeNorbix();

    await endpoints[key].query(args)(client);

    expect(endpoints[key].__kind).toBe(kind);
    expect(calls).toEqual([{ method: `api.${key}`, args }]);
  });

  it('getPaymentOrders provides the order list', () => {
    expect(endpoints.getPaymentOrders.providesTags).toEqual([
      { type: 'PaymentOrders', id: 'LIST' },
    ]);
  });

  it('getPaymentOrder provides the order by its id', () => {
    const tags = (endpoints.getPaymentOrder.providesTags as TagFn)(undefined, undefined, {
      id: 'ord_1',
    });
    expect(tags).toEqual([{ type: 'PaymentOrders', id: 'ord_1' }]);
  });

  it('createPaymentOrder invalidates the order lists', () => {
    expect(endpoints.createPaymentOrder.invalidatesTags).toEqual([
      { type: 'PaymentOrders', id: 'LIST' },
    ]);
  });

  it('startPaymentCheckout invalidates the order lists and that order', () => {
    const tags = (endpoints.startPaymentCheckout.invalidatesTags as TagFn)(undefined, undefined, {
      id: 'ord_1',
      integrationId: 'int_montonio',
    });
    expect(tags).toEqual([
      { type: 'PaymentOrders', id: 'LIST' },
      { type: 'PaymentOrders', id: 'ord_1' },
    ]);
  });

  it('is spread into the full endpoint set, and no Hub hook replaces it', async () => {
    const all = buildEndpoints(fakeBuilder()) as unknown as Record<string, Def>;
    const { calls, client } = fakeNorbix();

    for (const key of Object.keys(endpoints)) {
      await all[key].query({ id: 'ord_1' })(client);
    }

    expect(calls.map((c) => c.method)).toEqual(Object.keys(endpoints).map((k) => `api.${k}`));
  });
});
