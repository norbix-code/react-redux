import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

/**
 * `hub.code` marketplace — the catalog of listings, the installed connections
 * (`int_…`), their secrets, token mappings and validation test, the vendor
 * function catalog, and the functions added on a connection (`func_…`).
 * 1:1 with the marketplace methods of `norbix.hub.code` (gateway contract
 * `Code.Marketplace.md` §14).
 *
 * Tag conventions (all type `CodeMarketplace`):
 *   - `LISTINGS`                 — the catalog, one listing, a listing's function tokens
 *   - `INTEGRATIONS`             — the connection list
 *   - `<integrationViewId>`      — one connection (secrets, token mappings and the
 *                                  last validation steps live on it)
 *   - `CATALOG:<integrationId>`  — the vendor functions a connection offers
 *   - `FUNCTIONS:<integrationId>`— the functions added on a connection
 *   - `<functionViewId>`         — one function and its tokens
 *
 * Revealing secrets is a mutation on purpose: a query would keep the clear
 * values in the store's cache.
 */
export const hubCodeMarketplace = (b: Builder) => {
  type HC = Norbix['hub']['code'];
  type Fn<K extends keyof HC> = HC[K] extends (...a: never[]) => unknown ? HC[K] : never;

  type GetListings = Fn<'getMarketplaceListings'>;
  type GetListing = Fn<'getMarketplaceListing'>;
  type GetListingFunctionTokens = Fn<'getMarketplaceListingFunctionTokens'>;
  type GetIntegrations = Fn<'getMarketplaceIntegrations'>;
  type GetIntegration = Fn<'getMarketplaceIntegration'>;
  type SaveIntegration = Fn<'saveMarketplaceIntegration'>;
  type DeleteIntegration = Fn<'deleteMarketplaceIntegration'>;
  type EnableIntegration = Fn<'enableMarketplaceIntegration'>;
  type DisableIntegration = Fn<'disableMarketplaceIntegration'>;
  type ReplaceSecrets = Fn<'replaceMarketplaceIntegrationSecrets'>;
  type RevealSecrets = Fn<'revealMarketplaceIntegrationSecrets'>;
  type SetTokenMappings = Fn<'setMarketplaceIntegrationTokenMappings'>;
  type TestIntegration = Fn<'testMarketplaceIntegration'>;
  type GetCatalog = Fn<'getMarketplaceFunctionCatalog'>;
  type GetFunctions = Fn<'getMarketplaceFunctions'>;
  type GetFunction = Fn<'getMarketplaceFunction'>;
  type SaveFunction = Fn<'saveMarketplaceFunction'>;
  type DeleteFunction = Fn<'deleteMarketplaceFunction'>;
  type EnableFunction = Fn<'enableMarketplaceFunction'>;
  type DisableFunction = Fn<'disableMarketplaceFunction'>;
  type GetFunctionTokens = Fn<'getMarketplaceFunctionTokens'>;
  type InvokeFunction = Fn<'invokeMarketplaceFunction'>;

  const callHC = (norbix: Norbix) => norbix.hub.code as HC;

  const T = 'CodeMarketplace' as const;
  const integrationId = (arg: unknown) =>
    (arg as { integrationViewId?: string })?.integrationViewId ??
    (arg as { IntegrationViewId?: string })?.IntegrationViewId ??
    'CURRENT';
  const functionId = (arg: unknown) =>
    (arg as { functionViewId?: string })?.functionViewId ??
    (arg as { FunctionViewId?: string })?.FunctionViewId ??
    'CURRENT';
  const listings = [{ type: T, id: 'LISTINGS' }];
  const integration = (arg: unknown) => [
    { type: T, id: 'INTEGRATIONS' },
    { type: T, id: integrationId(arg) },
  ];
  const functions = (arg: unknown) => [
    { type: T, id: `FUNCTIONS:${integrationId(arg)}` },
    { type: T, id: functionId(arg) },
  ];

  return {
    // ---- Catalog ----
    getMarketplaceListings: b.query<Result<GetListings>, Arg<GetListings>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceListings(args),
      providesTags: listings,
    }),
    getMarketplaceListing: b.query<Result<GetListing>, Arg<GetListing>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceListing(args),
      providesTags: listings,
    }),
    getMarketplaceListingFunctionTokens: b.query<
      Result<GetListingFunctionTokens>,
      Arg<GetListingFunctionTokens>
    >({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceListingFunctionTokens(args),
      providesTags: listings,
    }),

    // ---- Connections ----
    getMarketplaceIntegrations: b.query<Result<GetIntegrations>, Arg<GetIntegrations>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceIntegrations(args),
      providesTags: [{ type: T, id: 'INTEGRATIONS' }],
    }),
    getMarketplaceIntegration: b.query<Result<GetIntegration>, Arg<GetIntegration>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceIntegration(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: integrationId(arg) }],
    }),
    saveMarketplaceIntegration: b.mutation<Result<SaveIntegration>, Arg<SaveIntegration>>({
      query: (args) => (norbix) => callHC(norbix).saveMarketplaceIntegration(args),
      invalidatesTags: [{ type: T, id: 'INTEGRATIONS' }],
    }),
    deleteMarketplaceIntegration: b.mutation<Result<DeleteIntegration>, Arg<DeleteIntegration>>({
      query: (args) => (norbix) => callHC(norbix).deleteMarketplaceIntegration(args),
      invalidatesTags: (_res, _err, arg) => [
        ...integration(arg),
        { type: T, id: `FUNCTIONS:${integrationId(arg)}` },
      ],
    }),
    enableMarketplaceIntegration: b.mutation<Result<EnableIntegration>, Arg<EnableIntegration>>({
      query: (args) => (norbix) => callHC(norbix).enableMarketplaceIntegration(args),
      invalidatesTags: (_res, _err, arg) => integration(arg),
    }),
    disableMarketplaceIntegration: b.mutation<Result<DisableIntegration>, Arg<DisableIntegration>>({
      query: (args) => (norbix) => callHC(norbix).disableMarketplaceIntegration(args),
      invalidatesTags: (_res, _err, arg) => integration(arg),
    }),
    replaceMarketplaceIntegrationSecrets: b.mutation<Result<ReplaceSecrets>, Arg<ReplaceSecrets>>({
      query: (args) => (norbix) => callHC(norbix).replaceMarketplaceIntegrationSecrets(args),
      invalidatesTags: (_res, _err, arg) => [{ type: T, id: integrationId(arg) }],
    }),
    revealMarketplaceIntegrationSecrets: b.mutation<Result<RevealSecrets>, Arg<RevealSecrets>>({
      query: (args) => (norbix) => callHC(norbix).revealMarketplaceIntegrationSecrets(args),
    }),
    setMarketplaceIntegrationTokenMappings: b.mutation<
      Result<SetTokenMappings>,
      Arg<SetTokenMappings>
    >({
      query: (args) => (norbix) => callHC(norbix).setMarketplaceIntegrationTokenMappings(args),
      invalidatesTags: (_res, _err, arg) => [{ type: T, id: integrationId(arg) }],
    }),
    testMarketplaceIntegration: b.mutation<Result<TestIntegration>, Arg<TestIntegration>>({
      query: (args) => (norbix) => callHC(norbix).testMarketplaceIntegration(args),
      invalidatesTags: (_res, _err, arg) => [{ type: T, id: integrationId(arg) }],
    }),
    getMarketplaceFunctionCatalog: b.query<Result<GetCatalog>, Arg<GetCatalog>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceFunctionCatalog(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: `CATALOG:${integrationId(arg)}` }],
    }),

    // ---- Functions on a connection ----
    getMarketplaceFunctions: b.query<Result<GetFunctions>, Arg<GetFunctions>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceFunctions(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: `FUNCTIONS:${integrationId(arg)}` }],
    }),
    getMarketplaceFunction: b.query<Result<GetFunction>, Arg<GetFunction>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceFunction(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: functionId(arg) }],
    }),
    saveMarketplaceFunction: b.mutation<Result<SaveFunction>, Arg<SaveFunction>>({
      query: (args) => (norbix) => callHC(norbix).saveMarketplaceFunction(args),
      invalidatesTags: (_res, _err, arg) => functions(arg),
    }),
    deleteMarketplaceFunction: b.mutation<Result<DeleteFunction>, Arg<DeleteFunction>>({
      query: (args) => (norbix) => callHC(norbix).deleteMarketplaceFunction(args),
      invalidatesTags: (_res, _err, arg) => functions(arg),
    }),
    enableMarketplaceFunction: b.mutation<Result<EnableFunction>, Arg<EnableFunction>>({
      query: (args) => (norbix) => callHC(norbix).enableMarketplaceFunction(args),
      invalidatesTags: (_res, _err, arg) => functions(arg),
    }),
    disableMarketplaceFunction: b.mutation<Result<DisableFunction>, Arg<DisableFunction>>({
      query: (args) => (norbix) => callHC(norbix).disableMarketplaceFunction(args),
      invalidatesTags: (_res, _err, arg) => functions(arg),
    }),
    getMarketplaceFunctionTokens: b.query<Result<GetFunctionTokens>, Arg<GetFunctionTokens>>({
      query: (args) => (norbix) => callHC(norbix).getMarketplaceFunctionTokens(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: functionId(arg) }],
    }),
    invokeMarketplaceFunction: b.mutation<Result<InvokeFunction>, Arg<InvokeFunction>>({
      query: (args) => (norbix) => callHC(norbix).invokeMarketplaceFunction(args),
    }),
  };
};
