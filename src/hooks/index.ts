import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { NorbixCall } from '../baseQuery.js';
import type { SerializedNorbixError } from '../errors.js';

import { apiApikeys } from './api/apikeys.js';
import { apiAuth } from './api/auth.js';
import { apiChat } from './api/chat.js';
import { apiDatabase } from './api/database.js';
import { apiFiles } from './api/files.js';
import { apiMembership } from './api/membership.js';
import { apiPublic } from './api/public.js';
import { hubAccount } from './hub/account.js';
import { hubAi } from './hub/ai.js';
import { hubApikeys } from './hub/apikeys.js';
import { hubDatabase } from './hub/database.js';
import { hubEmail } from './hub/email.js';
import { hubEnvironments } from './hub/environments.js';
import { hubFiles } from './hub/files.js';
import { hubLogs } from './hub/logs.js';
import { hubMembership } from './hub/membership.js';
import { hubNotifications } from './hub/notifications.js';
import { hubPayments } from './hub/payments.js';
import { hubRegions } from './hub/regions.js';
import { hubResources } from './hub/resources.js';
import { hubScheduler } from './hub/scheduler.js';
import { hubWebhooks } from './hub/webhooks.js';

/**
 * The complete set of cache tags every endpoint factory may use. Adding a
 * new tag means: (1) add it here; (2) declare it in `createNorbixApi`'s
 * `tagTypes`; (3) reference it from `providesTags` / `invalidatesTags`.
 *
 * The taxonomy mirrors the conventions used across Norbix admin UIs (and
 * the Norbix Cloud UI specifically), so cross-team RTK Query stores stay
 * consistent and developers can move between projects without relearning
 * tag names.
 */
export type AllTags =
  // ---- Account / config ----
  | 'Config'
  | 'Account'
  | 'AccountProfile'
  | 'AccountUsers'
  | 'Billing'
  | 'Projects'
  | 'Environments'
  | 'Regions'
  | 'ApiKey'
  // ---- Membership ----
  | 'Membership'
  | 'MembershipUsers'
  | 'MembershipRoles'
  | 'MembershipPolicies'
  | 'MembershipIntegrations'
  // ---- Database ----
  | 'Database'
  | 'DatabaseSchemas'
  | 'DatabaseCollections'
  | 'DatabaseRecords'
  | 'DatabaseTaxonomies'
  | 'DatabaseTaxonomyTerms'
  | 'DatabaseAggregates'
  | 'DatabaseIntegrations'
  | 'DatabaseImports'
  | 'DatabaseExports'
  | 'DatabaseBackups'
  // ---- Files ----
  | 'Files'
  | 'FilesIntegrations'
  // ---- Code ----
  | 'Code'
  | 'CodeIntegrations'
  | 'CodeFunctions'
  | 'CodeMarketplace'
  // ---- Email ----
  | 'Emails'
  | 'EmailTemplates'
  | 'EmailCampaigns'
  | 'EmailIntegrations'
  | 'EmailSignatures'
  | 'EmailFooters'
  | 'EmailSettings'
  // ---- Push ----
  | 'Push'
  | 'PushTemplates'
  | 'PushCampaigns'
  | 'PushIntegrations'
  // ---- Sms ----
  | 'Sms'
  | 'SmsTemplates'
  | 'SmsCampaigns'
  | 'SmsIntegrations'
  | 'SmsSettings'
  // ---- Payments ----
  | 'Payments'
  | 'PaymentIntegrations'
  | 'PaymentPlans'
  | 'PaymentDiscounts'
  | 'PaymentCustomers'
  // ---- AI ----
  | 'Ai'
  // ---- Webhooks ----
  | 'Webhooks'
  // ---- Contacts ----
  | 'Contacts'
  // ---- Other ----
  | 'Scheduler'
  | 'Triggers'
  | 'Logs'
  | 'LogsIntegrations';

/** Builder type the per-module endpoint factories accept. */
export type Builder = EndpointBuilder<
  BaseQueryFn<NorbixCall<unknown>, unknown, SerializedNorbixError>,
  AllTags,
  string
>;

/**
 * Build the full curated endpoint set for `createNorbixApi`. To grow the
 * library, add another factory under `hooks/api/...` or `hooks/hub/...`
 * and spread it into the returned object. To add hooks in *your own app*
 * without forking the package, use `norbixApi.injectEndpoints({...})` —
 * see the README for the pattern.
 *
 * NOTE: this set mirrors the full norbix core SDK surface — every public
 * `api.*` / `hub.*` method has a matching hook. If you still need an
 * app-specific variant, extend the API surface via `injectEndpoints`.
 */
export function buildEndpoints(builder: Builder) {
  return {
    // API surface (runtime, project-scoped)
    ...apiAuth(builder),
    ...apiMembership(builder),
    ...apiDatabase(builder),
    ...apiApikeys(builder),
    ...apiChat(builder),
    ...apiFiles(builder),
    ...apiPublic(builder),
    // Hub surface (control plane)
    ...hubAccount(builder),
    ...hubAi(builder),
    ...hubApikeys(builder),
    ...hubMembership(builder),
    ...hubDatabase(builder),
    ...hubFiles(builder),
    ...hubLogs(builder),
    ...hubNotifications(builder),
    ...hubPayments(builder),
    ...hubScheduler(builder),
    ...hubEmail(builder),
    ...hubEnvironments(builder),
    ...hubRegions(builder),
    ...hubResources(builder),
    ...hubWebhooks(builder),
  };
}
