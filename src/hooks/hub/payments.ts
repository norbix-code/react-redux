// AUTO-GENERATED — full coverage of `norbix.hub.payments` (16 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type DisablePayments = Norbix['hub']['payments']['disablePayments'];
type EnablePayments = Norbix['hub']['payments']['enablePayments'];
type DeletePaymentsTrigger = Norbix['hub']['payments']['deletePaymentsTrigger'];
type DisablePaymentsTrigger = Norbix['hub']['payments']['disablePaymentsTrigger'];
type EnablePaymentsTrigger = Norbix['hub']['payments']['enablePaymentsTrigger'];
type GetPaymentsTrigger = Norbix['hub']['payments']['getPaymentsTrigger'];
type GetPaymentsTriggers = Norbix['hub']['payments']['getPaymentsTriggers'];
type SavePaymentsTrigger = Norbix['hub']['payments']['savePaymentsTrigger'];
type ConfirmPaymentsIntegrationHumanDelivery = Norbix['hub']['payments']['confirmPaymentsIntegrationHumanDelivery'];
type DeletePaymentsIntegration = Norbix['hub']['payments']['deletePaymentsIntegration'];
type DisablePaymentsIntegration = Norbix['hub']['payments']['disablePaymentsIntegration'];
type EnablePaymentsIntegration = Norbix['hub']['payments']['enablePaymentsIntegration'];
type GetPaymentsIntegration = Norbix['hub']['payments']['getPaymentsIntegration'];
type GetPaymentsIntegrations = Norbix['hub']['payments']['getPaymentsIntegrations'];
type SavePaymentsIntegration = Norbix['hub']['payments']['savePaymentsIntegration'];
type TestPaymentsIntegration = Norbix['hub']['payments']['testPaymentsIntegration'];

/**
 * `hub.payments` — 16 endpoints, 1:1 with the core SDK.
 */
export const hubPayments = (b: Builder) => ({
  disablePayments: b.mutation<Result<DisablePayments>, Arg<DisablePayments>>({
    query: (args) => (norbix) => norbix.hub.payments.disablePayments(args),
    invalidatesTags: ['Payments'],
  }),

  enablePayments: b.mutation<Result<EnablePayments>, Arg<EnablePayments>>({
    query: (args) => (norbix) => norbix.hub.payments.enablePayments(args),
    invalidatesTags: ['Payments'],
  }),

  deletePaymentsTrigger: b.mutation<Result<DeletePaymentsTrigger>, Arg<DeletePaymentsTrigger>>({
    query: (args) => (norbix) => norbix.hub.payments.deletePaymentsTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  disablePaymentsTrigger: b.mutation<Result<DisablePaymentsTrigger>, Arg<DisablePaymentsTrigger>>({
    query: (args) => (norbix) => norbix.hub.payments.disablePaymentsTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  enablePaymentsTrigger: b.mutation<Result<EnablePaymentsTrigger>, Arg<EnablePaymentsTrigger>>({
    query: (args) => (norbix) => norbix.hub.payments.enablePaymentsTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  getPaymentsTrigger: b.query<Result<GetPaymentsTrigger>, Arg<GetPaymentsTrigger>>({
    query: (args) => (norbix) => norbix.hub.payments.getPaymentsTrigger(args),
    providesTags: ['Triggers'],
  }),

  getPaymentsTriggers: b.query<Result<GetPaymentsTriggers>, Arg<GetPaymentsTriggers>>({
    query: (args) => (norbix) => norbix.hub.payments.getPaymentsTriggers(args),
    providesTags: ['Triggers'],
  }),

  savePaymentsTrigger: b.mutation<Result<SavePaymentsTrigger>, Arg<SavePaymentsTrigger>>({
    query: (args) => (norbix) => norbix.hub.payments.savePaymentsTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  confirmPaymentsIntegrationHumanDelivery: b.mutation<Result<ConfirmPaymentsIntegrationHumanDelivery>, Arg<ConfirmPaymentsIntegrationHumanDelivery>>({
    query: (args) => (norbix) => norbix.hub.payments.confirmPaymentsIntegrationHumanDelivery(args),
    invalidatesTags: ['PaymentIntegrations'],
  }),

  deletePaymentsIntegration: b.mutation<Result<DeletePaymentsIntegration>, Arg<DeletePaymentsIntegration>>({
    query: (args) => (norbix) => norbix.hub.payments.deletePaymentsIntegration(args),
    invalidatesTags: ['PaymentIntegrations'],
  }),

  disablePaymentsIntegration: b.mutation<Result<DisablePaymentsIntegration>, Arg<DisablePaymentsIntegration>>({
    query: (args) => (norbix) => norbix.hub.payments.disablePaymentsIntegration(args),
    invalidatesTags: ['PaymentIntegrations'],
  }),

  enablePaymentsIntegration: b.mutation<Result<EnablePaymentsIntegration>, Arg<EnablePaymentsIntegration>>({
    query: (args) => (norbix) => norbix.hub.payments.enablePaymentsIntegration(args),
    invalidatesTags: ['PaymentIntegrations'],
  }),

  getPaymentsIntegration: b.query<Result<GetPaymentsIntegration>, Arg<GetPaymentsIntegration>>({
    query: (args) => (norbix) => norbix.hub.payments.getPaymentsIntegration(args),
    providesTags: ['PaymentIntegrations'],
  }),

  getPaymentsIntegrations: b.query<Result<GetPaymentsIntegrations>, Arg<GetPaymentsIntegrations>>({
    query: (args) => (norbix) => norbix.hub.payments.getPaymentsIntegrations(args),
    providesTags: ['PaymentIntegrations'],
  }),

  savePaymentsIntegration: b.mutation<Result<SavePaymentsIntegration>, Arg<SavePaymentsIntegration>>({
    query: (args) => (norbix) => norbix.hub.payments.savePaymentsIntegration(args),
    invalidatesTags: ['PaymentIntegrations'],
  }),

  testPaymentsIntegration: b.mutation<Result<TestPaymentsIntegration>, Arg<TestPaymentsIntegration>>({
    query: (args) => (norbix) => norbix.hub.payments.testPaymentsIntegration(args),
    invalidatesTags: ['PaymentIntegrations'],
  }),
});
