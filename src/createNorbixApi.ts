import { createApi } from '@reduxjs/toolkit/query/react';

import { createNorbixBaseQuery, type GetNorbixClient } from './baseQuery.js';
import { buildEndpoints, type AllTags } from './hooks/index.js';

/**
 * Create the RTK Query API slice that wraps the Norbix SDK.
 *
 * Call this once at app startup, then add `norbixApi.reducer` and
 * `norbixApi.middleware` to your Redux store. The returned object also
 * carries the auto-generated React hooks for every endpoint we ship.
 *
 * @param getClient
 *   Function that returns the live Norbix client. Called on every request,
 *   so you can swap clients per-tenant / per-request without recreating the
 *   API. The simplest pattern: pass a constant `() => norbix`.
 *
 * @param options.reducerPath
 *   Override the slice key in the Redux state (default: `"norbix"`).
 *
 * @example
 * ```ts
 * const norbix = new Norbix({ apiKey, projectId });
 * export const norbixApi = createNorbixApi(() => norbix);
 * export const {
 *   useGetUsersQuery,
 *   useRegisterUserMutation,
 *   useFindCollectionQuery,
 *   useInsertOneMutation,
 * } = norbixApi;
 * ```
 */
export function createNorbixApi(
  getClient: GetNorbixClient,
  options: { reducerPath?: string } = {},
) {
  const reducerPath = options.reducerPath ?? 'norbix';

  return createApi({
    reducerPath,
    baseQuery: createNorbixBaseQuery(getClient),
    tagTypes: [
      // Account / config
      'Config',
      'Account',
      'AccountProfile',
      'AccountUsers',
      'Billing',
      'Projects',
      'ApiKey',
      // Membership
      'Membership',
      'MembershipUsers',
      'MembershipRoles',
      'MembershipPolicies',
      'MembershipIntegrations',
      // Database
      'Database',
      'DatabaseSchemas',
      'DatabaseCollections',
      'DatabaseRecords',
      'DatabaseTaxonomies',
      'DatabaseTaxonomyTerms',
      'DatabaseAggregates',
      'DatabaseIntegrations',
      'DatabaseImports',
      'DatabaseExports',
      'DatabaseBackups',
      // Files
      'Files',
      'FilesIntegrations',
      // Code
      'Code',
      'CodeIntegrations',
      'CodeFunctions',
      'CodeMarketplace',
      // Email
      'Emails',
      'EmailTemplates',
      'EmailCampaigns',
      'EmailIntegrations',
      'EmailSignatures',
      'EmailFooters',
      'EmailSettings',
      // Push
      'Push',
      'PushTemplates',
      'PushCampaigns',
      'PushIntegrations',
      // Sms
      'Sms',
      'SmsTemplates',
      'SmsCampaigns',
      'SmsIntegrations',
      'SmsSettings',
      // Payments
      'Payments',
      'PaymentIntegrations',
      'PaymentPlans',
      'PaymentDiscounts',
      'PaymentCustomers',
      // Other
      'Scheduler',
      'Triggers',
      'Logs',
      'LogsIntegrations',
    ] satisfies AllTags[],
    endpoints: (builder) => buildEndpoints(builder),
  });
}

export type NorbixApi = ReturnType<typeof createNorbixApi>;
