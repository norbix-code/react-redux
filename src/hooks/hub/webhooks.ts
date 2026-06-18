// AUTO-GENERATED — full coverage of `norbix.hub.webhooks` (9 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetWebhookIntegration = Norbix['hub']['webhooks']['getWebhookIntegration'];
type RevealWebhookIntegrationSecret = Norbix['hub']['webhooks']['revealWebhookIntegrationSecret'];
type RotateWebhookIntegrationSecret = Norbix['hub']['webhooks']['rotateWebhookIntegrationSecret'];
type UpdateWebhookIntegrationExtraHeaders = Norbix['hub']['webhooks']['updateWebhookIntegrationExtraHeaders'];
type ReceiveWebhook = Norbix['hub']['webhooks']['receiveWebhook'];
type DisableWebhookDestination = Norbix['hub']['webhooks']['disableWebhookDestination'];
type EnableWebhookDestination = Norbix['hub']['webhooks']['enableWebhookDestination'];
type RemoveWebhookDestination = Norbix['hub']['webhooks']['removeWebhookDestination'];
type SaveWebhookDestination = Norbix['hub']['webhooks']['saveWebhookDestination'];

/**
 * `hub.webhooks` — 9 endpoints, 1:1 with the core SDK.
 */
export const hubWebhooks = (b: Builder) => ({
  getWebhookIntegration: b.query<Result<GetWebhookIntegration>, Arg<GetWebhookIntegration>>({
    query: (args) => (norbix) => norbix.hub.webhooks.getWebhookIntegration(args),
    providesTags: ['Webhooks'],
  }),

  revealWebhookIntegrationSecret: b.mutation<Result<RevealWebhookIntegrationSecret>, Arg<RevealWebhookIntegrationSecret>>({
    query: (args) => (norbix) => norbix.hub.webhooks.revealWebhookIntegrationSecret(args),
    invalidatesTags: ['Webhooks'],
  }),

  rotateWebhookIntegrationSecret: b.mutation<Result<RotateWebhookIntegrationSecret>, Arg<RotateWebhookIntegrationSecret>>({
    query: (args) => (norbix) => norbix.hub.webhooks.rotateWebhookIntegrationSecret(args),
    invalidatesTags: ['Webhooks'],
  }),

  updateWebhookIntegrationExtraHeaders: b.mutation<Result<UpdateWebhookIntegrationExtraHeaders>, Arg<UpdateWebhookIntegrationExtraHeaders>>({
    query: (args) => (norbix) => norbix.hub.webhooks.updateWebhookIntegrationExtraHeaders(args),
    invalidatesTags: ['Webhooks'],
  }),

  receiveWebhook: b.mutation<Result<ReceiveWebhook>, Arg<ReceiveWebhook>>({
    query: (args) => (norbix) => norbix.hub.webhooks.receiveWebhook(args),
    invalidatesTags: ['Webhooks'],
  }),

  disableWebhookDestination: b.mutation<Result<DisableWebhookDestination>, Arg<DisableWebhookDestination>>({
    query: (args) => (norbix) => norbix.hub.webhooks.disableWebhookDestination(args),
    invalidatesTags: ['Webhooks'],
  }),

  enableWebhookDestination: b.mutation<Result<EnableWebhookDestination>, Arg<EnableWebhookDestination>>({
    query: (args) => (norbix) => norbix.hub.webhooks.enableWebhookDestination(args),
    invalidatesTags: ['Webhooks'],
  }),

  removeWebhookDestination: b.mutation<Result<RemoveWebhookDestination>, Arg<RemoveWebhookDestination>>({
    query: (args) => (norbix) => norbix.hub.webhooks.removeWebhookDestination(args),
    invalidatesTags: ['Webhooks'],
  }),

  saveWebhookDestination: b.mutation<Result<SaveWebhookDestination>, Arg<SaveWebhookDestination>>({
    query: (args) => (norbix) => norbix.hub.webhooks.saveWebhookDestination(args),
    invalidatesTags: ['Webhooks'],
  }),
});
