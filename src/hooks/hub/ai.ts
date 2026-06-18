// AUTO-GENERATED — full coverage of `norbix.hub.ai` (14 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type DeleteLlmIntegration = Norbix['hub']['ai']['deleteLlmIntegration'];
type DisableLlmIntegration = Norbix['hub']['ai']['disableLlmIntegration'];
type EnableLlmIntegration = Norbix['hub']['ai']['enableLlmIntegration'];
type GetLlmIntegration = Norbix['hub']['ai']['getLlmIntegration'];
type GetLlmIntegrations = Norbix['hub']['ai']['getLlmIntegrations'];
type SaveLlmIntegration = Norbix['hub']['ai']['saveLlmIntegration'];
type TestLlmIntegration = Norbix['hub']['ai']['testLlmIntegration'];
type DeleteMcpIntegration = Norbix['hub']['ai']['deleteMcpIntegration'];
type DisableMcpIntegration = Norbix['hub']['ai']['disableMcpIntegration'];
type EnableMcpIntegration = Norbix['hub']['ai']['enableMcpIntegration'];
type GetMcpIntegration = Norbix['hub']['ai']['getMcpIntegration'];
type GetMcpIntegrations = Norbix['hub']['ai']['getMcpIntegrations'];
type SaveMcpIntegration = Norbix['hub']['ai']['saveMcpIntegration'];
type TestMcpIntegration = Norbix['hub']['ai']['testMcpIntegration'];

/**
 * `hub.ai` — 14 endpoints, 1:1 with the core SDK.
 */
export const hubAi = (b: Builder) => ({
  deleteLlmIntegration: b.mutation<Result<DeleteLlmIntegration>, Arg<DeleteLlmIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.deleteLlmIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  disableLlmIntegration: b.mutation<Result<DisableLlmIntegration>, Arg<DisableLlmIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.disableLlmIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  enableLlmIntegration: b.mutation<Result<EnableLlmIntegration>, Arg<EnableLlmIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.enableLlmIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  getLlmIntegration: b.query<Result<GetLlmIntegration>, Arg<GetLlmIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.getLlmIntegration(args),
    providesTags: ['Ai'],
  }),

  getLlmIntegrations: b.query<Result<GetLlmIntegrations>, Arg<GetLlmIntegrations>>({
    query: (args) => (norbix) => norbix.hub.ai.getLlmIntegrations(args),
    providesTags: ['Ai'],
  }),

  saveLlmIntegration: b.mutation<Result<SaveLlmIntegration>, Arg<SaveLlmIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.saveLlmIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  testLlmIntegration: b.mutation<Result<TestLlmIntegration>, Arg<TestLlmIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.testLlmIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  deleteMcpIntegration: b.mutation<Result<DeleteMcpIntegration>, Arg<DeleteMcpIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.deleteMcpIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  disableMcpIntegration: b.mutation<Result<DisableMcpIntegration>, Arg<DisableMcpIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.disableMcpIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  enableMcpIntegration: b.mutation<Result<EnableMcpIntegration>, Arg<EnableMcpIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.enableMcpIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  getMcpIntegration: b.query<Result<GetMcpIntegration>, Arg<GetMcpIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.getMcpIntegration(args),
    providesTags: ['Ai'],
  }),

  getMcpIntegrations: b.query<Result<GetMcpIntegrations>, Arg<GetMcpIntegrations>>({
    query: (args) => (norbix) => norbix.hub.ai.getMcpIntegrations(args),
    providesTags: ['Ai'],
  }),

  saveMcpIntegration: b.mutation<Result<SaveMcpIntegration>, Arg<SaveMcpIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.saveMcpIntegration(args),
    invalidatesTags: ['Ai'],
  }),

  testMcpIntegration: b.mutation<Result<TestMcpIntegration>, Arg<TestMcpIntegration>>({
    query: (args) => (norbix) => norbix.hub.ai.testMcpIntegration(args),
    invalidatesTags: ['Ai'],
  }),
});
