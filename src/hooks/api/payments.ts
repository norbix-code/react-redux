// `norbix.api.payments` — payment orders and their checkout (4 endpoints).
//
// The gateway routes behind these hooks, so the endpoint-coverage matrix can
// see them (it looks for the route string in the source). This file never
// builds a URL itself — the core SDK does — so these are documentation:
//
//   POST   /{version}/payments/orders
//   GET    /{version}/payments/orders
//   GET    /{version}/payments/orders/{Id}
//   POST   /{version}/payments/orders/{Id}/checkout
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type CreatePaymentOrder = Norbix['api']['payments']['createPaymentOrder'];
type GetPaymentOrder = Norbix['api']['payments']['getPaymentOrder'];
type GetPaymentOrders = Norbix['api']['payments']['getPaymentOrders'];
type StartPaymentCheckout = Norbix['api']['payments']['startPaymentCheckout'];

/**
 * `api.payments` — 4 endpoints, 1:1 with the core SDK.
 *
 * Cache: every order list is `PaymentOrders/LIST`, one order is
 * `PaymentOrders/<id>`. Creating an order invalidates the lists; starting a
 * checkout invalidates the lists and that order (a checkout attempt is added
 * to it, and the gateway may move its status).
 *
 * An order's status also moves when the provider confirms the payment, which
 * happens outside this store — refetch (or poll) `useGetPaymentOrderQuery`
 * after the buyer comes back on the `returnUrl`.
 */
export const apiPayments = (b: Builder) => ({
  /**
   * Creates a payment order: `buyerUserId`, `merchantReference`, `currency`,
   * `priceVersion`, `lines` (`sku?`, `title?`, `quantity`, `unitAmountMinor`
   * in minor units) and an optional `metadata` string map. Answers `{ id }`
   * (`ord_…`). Send an `idempotencyKey` (8+ characters) to make a retry
   * safe: the same body with the same key answers the same id.
   */
  createPaymentOrder: b.mutation<Result<CreatePaymentOrder>, Arg<CreatePaymentOrder>>({
    query: (args) => (norbix) => norbix.api.payments.createPaymentOrder(args),
    invalidatesTags: [{ type: 'PaymentOrders', id: 'LIST' }],
  }),

  /** Reads one payment order (`id`). Answers `{ item: PaymentOrderDto }`. */
  getPaymentOrder: b.query<Result<GetPaymentOrder>, Arg<GetPaymentOrder>>({
    query: (args) => (norbix) => norbix.api.payments.getPaymentOrder(args),
    providesTags: (_res, _err, arg) => [
      { type: 'PaymentOrders' as const, id: arg?.id ?? 'unknown' },
    ],
  }),

  /**
   * Lists payment orders, filtered by the optional `buyerUserId`,
   * `merchantReference` and `status`. Answers `{ list }` (paginated
   * `PaymentOrderDto`).
   */
  getPaymentOrders: b.query<Result<GetPaymentOrders>, Arg<GetPaymentOrders>>({
    query: (args) => (norbix) => norbix.api.payments.getPaymentOrders(args),
    providesTags: [{ type: 'PaymentOrders', id: 'LIST' }],
  }),

  /**
   * Starts (or reuses) a checkout for an order: `id`, `integrationId`,
   * `returnUrl`, and optionally `method`, `preferredCountry`,
   * `preferredProvider`. Answers `{ checkout, reused, order }` — send the
   * buyer to `checkout.paymentUrl`.
   */
  startPaymentCheckout: b.mutation<Result<StartPaymentCheckout>, Arg<StartPaymentCheckout>>({
    query: (args) => (norbix) => norbix.api.payments.startPaymentCheckout(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'PaymentOrders' as const, id: 'LIST' },
      { type: 'PaymentOrders' as const, id: arg?.id ?? 'unknown' },
    ],
  }),
});
