import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

/**
 * `hub.code` — the Code module switch, the Code integrations (AWS Lambda,
 * Azure Functions, Google Cloud Functions credentials) and the cloud functions
 * they may call: list, aliases / versions, a call by hand, a sample envelope
 * and the last runs of a trigger or task. The marketplace half of `hub.code`
 * is not wrapped here.
 *
 * Tag conventions:
 *   - `Code`                       — module state
 *   - `CodeIntegrations/LIST`      — integration list
 *   - `CodeIntegrations/<id>`      — one integration
 *   - `CodeFunctions/LIST`         — functions and qualifiers (read live from the provider)
 *   - `CodeFunctions/RUNS`         — last runs
 *   - `CodeFunctions/SAMPLE`       — sample envelopes
 *
 * The function methods need `@norbix.ai/ts` 4.19.0.
 */
export const hubCode = (b: Builder) => {
  type HC = Norbix['hub']['code'];
  type Fn<K extends keyof HC> = HC[K] extends (...a: never[]) => unknown ? HC[K] : never;

  type EnableModule = Fn<'enableCode'>;
  type DisableModule = Fn<'disableCode'>;
  type GetIntegrations = Fn<'getCodeIntegrations'>;
  type GetIntegration = Fn<'getCodeIntegration'>;
  type SaveIntegration = Fn<'saveCodeIntegration'>;
  type DeleteIntegration = Fn<'deleteCodeIntegration'>;
  type EnableIntegration = Fn<'enableCodeIntegration'>;
  type DisableIntegration = Fn<'disableCodeIntegration'>;
  type SetIntegrationAsDefault = Fn<'setCodeIntegrationAsDefault'>;
  type TestIntegration = Fn<'testCodeIntegration'>;
  type GetFunctions = Fn<'getCodeFunctions'>;
  type GetQualifiers = Fn<'getCodeFunctionQualifiers'>;
  type GetEventSample = Fn<'getCodeFunctionEventSample'>;
  type GetRuns = Fn<'getCodeFunctionRuns'>;
  type Invoke = Fn<'invokeCodeFunction'>;

  const callHC = (norbix: Norbix) => norbix.hub.code as HC;

  const integrationTags = (arg: unknown) => [
    { type: 'CodeIntegrations' as const, id: 'LIST' },
    {
      type: 'CodeIntegrations' as const,
      id: (arg as { id?: string; Id?: string })?.id ?? (arg as { Id?: string })?.Id ?? 'CURRENT',
    },
  ];

  return {
    // ---- Module toggle ----
    enableCodeModule: b.mutation<Result<EnableModule>, Arg<EnableModule>>({
      query: (args) => (norbix) => callHC(norbix).enableCode(args),
      invalidatesTags: ['Account', 'Projects', 'Code'],
    }),
    disableCodeModule: b.mutation<Result<DisableModule>, Arg<DisableModule>>({
      query: (args) => (norbix) => callHC(norbix).disableCode(args),
      invalidatesTags: ['Account', 'Projects', 'Code'],
    }),

    // ---- Integrations ----
    getCodeIntegrations: b.query<Result<GetIntegrations>, Arg<GetIntegrations>>({
      query: (args) => (norbix) => callHC(norbix).getCodeIntegrations(args),
      providesTags: [{ type: 'CodeIntegrations', id: 'LIST' }],
    }),

    getCodeIntegration: b.query<Result<GetIntegration>, Arg<GetIntegration>>({
      query: (args) => (norbix) => callHC(norbix).getCodeIntegration(args),
      providesTags: (_res, _err, arg) => [
        { type: 'CodeIntegrations', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),

    saveCodeIntegration: b.mutation<Result<SaveIntegration>, Arg<SaveIntegration>>({
      query: (args) => (norbix) => callHC(norbix).saveCodeIntegration(args),
      invalidatesTags: (_res, _err, arg) => integrationTags(arg),
    }),

    deleteCodeIntegration: b.mutation<Result<DeleteIntegration>, Arg<DeleteIntegration>>({
      query: (args) => (norbix) => callHC(norbix).deleteCodeIntegration(args),
      invalidatesTags: (_res, _err, arg) => integrationTags(arg),
    }),

    enableCodeIntegration: b.mutation<Result<EnableIntegration>, Arg<EnableIntegration>>({
      query: (args) => (norbix) => callHC(norbix).enableCodeIntegration(args),
      invalidatesTags: (_res, _err, arg) => integrationTags(arg),
    }),

    disableCodeIntegration: b.mutation<Result<DisableIntegration>, Arg<DisableIntegration>>({
      query: (args) => (norbix) => callHC(norbix).disableCodeIntegration(args),
      invalidatesTags: (_res, _err, arg) => integrationTags(arg),
    }),

    setCodeIntegrationAsDefault: b.mutation<
      Result<SetIntegrationAsDefault>,
      Arg<SetIntegrationAsDefault>
    >({
      query: (args) => (norbix) => callHC(norbix).setCodeIntegrationAsDefault(args),
      // The default flag moves between integrations: the whole list changes.
      invalidatesTags: ['CodeIntegrations'],
    }),

    testCodeIntegration: b.mutation<Result<TestIntegration>, Arg<TestIntegration>>({
      query: (args) => (norbix) => callHC(norbix).testCodeIntegration(args),
    }),

    // ---- Cloud functions (core SDK 4.19.0) ----
    getCodeFunctions: b.query<Result<GetFunctions>, Arg<GetFunctions>>({
      query: (args) => (norbix) => callHC(norbix).getCodeFunctions(args),
      providesTags: [{ type: 'CodeFunctions', id: 'LIST' }],
    }),

    getCodeFunctionQualifiers: b.query<Result<GetQualifiers>, Arg<GetQualifiers>>({
      query: (args) => (norbix) => callHC(norbix).getCodeFunctionQualifiers(args),
      providesTags: [{ type: 'CodeFunctions', id: 'LIST' }],
    }),

    getCodeFunctionEventSample: b.query<Result<GetEventSample>, Arg<GetEventSample>>({
      query: (args) => (norbix) => callHC(norbix).getCodeFunctionEventSample(args),
      providesTags: [{ type: 'CodeFunctions', id: 'SAMPLE' }],
    }),

    getCodeFunctionRuns: b.query<Result<GetRuns>, Arg<GetRuns>>({
      query: (args) => (norbix) => callHC(norbix).getCodeFunctionRuns(args),
      providesTags: [{ type: 'CodeFunctions', id: 'RUNS' }],
    }),

    invokeCodeFunction: b.mutation<Result<Invoke>, Arg<Invoke>>({
      query: (args) => (norbix) => callHC(norbix).invokeCodeFunction(args),
    }),
  };
};
