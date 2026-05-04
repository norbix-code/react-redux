import type { Norbix } from 'norbix';

import type { Builder, AllTags } from '../hooks/index.js';

/**
 * One-line generator for the standard "*Integrations" CRUD surface that
 * almost every Hub module exposes (database, files, payments, code, logs,
 * email, push, sms, membership). Generates these endpoints at once:
 *
 *   - `get<Prefix>Integrations`            (query, providesTag INTEGRATIONS_LIST)
 *   - `get<Prefix>Integration`             (query, providesTag <id>)
 *   - `save<Prefix>Integration`            (mutation, invalidates LIST)
 *   - `delete<Prefix>Integration`          (mutation, invalidates LIST + <id>)
 *   - `enable<Prefix>Integration`          (mutation, invalidates LIST + <id>)
 *   - `disable<Prefix>Integration`         (mutation, invalidates LIST + <id>)
 *   - `set<Prefix>IntegrationAsDefault`    (mutation, invalidates LIST + <id>)
 *   - `test<Prefix>Integration`            (mutation, optional)
 *   - `confirm<Prefix>IntegrationHumanDelivery` (mutation, optional)
 *
 * Spread the result into your endpoint factory (or `injectEndpoints`):
 *
 * ```ts
 * norbixApi.injectEndpoints({
 *   endpoints: (b) => ({
 *     ...buildIntegrationsEndpoints(b, {
 *       prefix: 'Email',
 *       tag: 'EmailIntegrations',
 *       namespace: (n) => n.hub.notifications,
 *       include: { test: true, confirmHumanDelivery: true },
 *     }),
 *   }),
 * });
 * // → useGetEmailIntegrationsQuery, useSaveEmailIntegrationMutation, ... auto-exist
 * ```
 *
 * **About types.** Because endpoint keys are computed at runtime, the
 * helper uses `any` internally for the request and response shapes. The
 * generated React hooks return `any` data unless you cast at the call
 * site or define the endpoint manually. For full type safety on a single
 * integration surface, follow the canonical pattern in
 * `src/hooks/hub/database.ts` (manual definitions) instead.
 *
 * **About method names.** Defaults follow the SDK's codegen conventions.
 * Some modules use slightly different names (e.g., `createXIntegration`
 * instead of `saveXIntegration`); pass `methodNames` to override.
 */
export interface BuildIntegrationsOptions<
  Prefix extends string,
  Tag extends AllTags,
> {
  /** Tag type for cache invalidation, e.g., `'EmailIntegrations'`. */
  tag: Tag;
  /**
   * Method-name prefix in the SDK. Capitalised. Examples:
   *   `'Email'` → `getEmailIntegrations`, `saveEmailIntegration`, ...
   *   `'Database'` → `getDatabaseIntegrations`, ...
   *   `'Logging'` → `getLoggingIntegrations`, ... (logs uses `Logging` prefix)
   */
  prefix: Prefix;
  /**
   * Function returning the SDK namespace that exposes the integration methods.
   * For email/push/sms this is `norbix.hub.notifications`; for everything
   * else it's `norbix.hub.<moduleKey>`.
   */
  namespace: (norbix: Norbix) => Record<string, (...args: never[]) => Promise<unknown>>;
  /**
   * Optional toggles for integration methods that don't exist on every
   * module. Defaults: test=true, confirmHumanDelivery=false.
   */
  include?: {
    test?: boolean;
    confirmHumanDelivery?: boolean;
  };
  /** Override default method names for SDKs that diverge from convention. */
  methodNames?: Partial<{
    list: string;
    one: string;
    save: string;
    delete: string;
    enable: string;
    disable: string;
    setDefault: string;
    test: string;
    confirmHumanDelivery: string;
  }>;
}

/**
 * Lookup keys produced by the helper, derived from `Prefix` so RTK Query
 * generates the correct `useGet<Prefix>IntegrationsQuery` hooks etc.
 */
export type IntegrationEndpointKeys<P extends string> =
  | `get${P}Integrations`
  | `get${P}Integration`
  | `save${P}Integration`
  | `delete${P}Integration`
  | `enable${P}Integration`
  | `disable${P}Integration`
  | `set${P}IntegrationAsDefault`
  | `test${P}Integration`
  | `confirm${P}IntegrationHumanDelivery`;

/**
 * Build the integrations CRUD endpoint set for one Hub module.
 *
 * @returns A record of endpoints keyed by the conventional method names
 *   (e.g., `getEmailIntegrations`, `saveEmailIntegration`, ...). Spread
 *   this into your endpoint factory.
 */
export function buildIntegrationsEndpoints<
  Prefix extends string,
  Tag extends AllTags,
>(
  b: Builder,
  opts: BuildIntegrationsOptions<Prefix, Tag>,
): Record<IntegrationEndpointKeys<Prefix>, unknown> {
  const { tag, prefix, namespace } = opts;
  const m = opts.methodNames ?? {};

  const list = (m.list ?? `get${prefix}Integrations`) as IntegrationEndpointKeys<Prefix>;
  const one = (m.one ?? `get${prefix}Integration`) as IntegrationEndpointKeys<Prefix>;
  const save = (m.save ?? `save${prefix}Integration`) as IntegrationEndpointKeys<Prefix>;
  const del = (m.delete ?? `delete${prefix}Integration`) as IntegrationEndpointKeys<Prefix>;
  const enable = (m.enable ?? `enable${prefix}Integration`) as IntegrationEndpointKeys<Prefix>;
  const disable = (m.disable ?? `disable${prefix}Integration`) as IntegrationEndpointKeys<Prefix>;
  const setDefault = (m.setDefault ??
    `set${prefix}IntegrationAsDefault`) as IntegrationEndpointKeys<Prefix>;
  const test = (m.test ?? `test${prefix}Integration`) as IntegrationEndpointKeys<Prefix>;
  const confirmHumanDelivery = (m.confirmHumanDelivery ??
    `confirm${prefix}IntegrationHumanDelivery`) as IntegrationEndpointKeys<Prefix>;

  // Looser typing inside — the helper trades static method-arg/result types
  // for terseness. Hook names are still correct.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyArg = any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type AnyRes = any;

  const callMethod =
    (methodName: string) =>
    (args: AnyArg) =>
    (norbix: Norbix): Promise<AnyRes> => {
      const ns = namespace(norbix);
      const fn = ns[methodName];
      if (typeof fn !== 'function') {
        return Promise.reject(
          new Error(
            `@norbix/react-redux: SDK method "${methodName}" not found. ` +
              `Check your SDK version or pass methodNames overrides.`,
          ),
        );
      }
      return (fn as (a: AnyArg) => Promise<AnyRes>)(args);
    };

  const endpoints = {
    [list]: b.query<AnyRes, AnyArg>({
      query: callMethod(list),
      providesTags: [{ type: tag, id: 'INTEGRATIONS_LIST' }],
    }),
    [one]: b.query<AnyRes, AnyArg>({
      query: callMethod(one),
      providesTags: (_r, _e, arg) => [{ type: tag, id: (arg as { id?: string })?.id ?? 'CURRENT' }],
    }),
    [save]: b.mutation<AnyRes, AnyArg>({
      query: callMethod(save),
      invalidatesTags: (_r, _e, arg) => [
        { type: tag, id: 'INTEGRATIONS_LIST' },
        { type: tag, id: (arg as { id?: string })?.id ?? '' },
      ],
    }),
    [del]: b.mutation<AnyRes, AnyArg>({
      query: callMethod(del),
      invalidatesTags: (_r, _e, arg) => [
        { type: tag, id: 'INTEGRATIONS_LIST' },
        { type: tag, id: (arg as { id?: string })?.id ?? '' },
      ],
    }),
    [enable]: b.mutation<AnyRes, AnyArg>({
      query: callMethod(enable),
      invalidatesTags: (_r, _e, arg) => [
        { type: tag, id: 'INTEGRATIONS_LIST' },
        { type: tag, id: (arg as { id?: string })?.id ?? '' },
      ],
    }),
    [disable]: b.mutation<AnyRes, AnyArg>({
      query: callMethod(disable),
      invalidatesTags: (_r, _e, arg) => [
        { type: tag, id: 'INTEGRATIONS_LIST' },
        { type: tag, id: (arg as { id?: string })?.id ?? '' },
      ],
    }),
    [setDefault]: b.mutation<AnyRes, AnyArg>({
      query: callMethod(setDefault),
      invalidatesTags: (_r, _e, arg) => [
        { type: tag, id: 'INTEGRATIONS_LIST' },
        { type: tag, id: (arg as { id?: string })?.id ?? '' },
      ],
    }),
  } as Record<IntegrationEndpointKeys<Prefix>, unknown>;

  // Optional methods — gated by `include` flags. Default: test=true,
  // confirmHumanDelivery=false (only email/push/sms have it).
  if (opts.include?.test !== false) {
    (endpoints as Record<string, unknown>)[test] = b.mutation<AnyRes, AnyArg>({
      query: callMethod(test),
      invalidatesTags: (_r, _e, arg) =>
        (arg as { integrationId?: string })?.integrationId
          ? [{ type: tag, id: (arg as { integrationId: string }).integrationId }]
          : [],
    });
  }

  if (opts.include?.confirmHumanDelivery === true) {
    (endpoints as Record<string, unknown>)[confirmHumanDelivery] = b.mutation<AnyRes, AnyArg>({
      query: callMethod(confirmHumanDelivery),
      invalidatesTags: (_r, _e, arg) =>
        (arg as { integrationId?: string })?.integrationId
          ? [{ type: tag, id: (arg as { integrationId: string }).integrationId }]
          : [],
    });
  }

  return endpoints;
}
