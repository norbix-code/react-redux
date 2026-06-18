// AUTO-GENERATED — full coverage of `norbix.hub.logs` (10 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type DisableLogging = Norbix['hub']['logs']['disableLogging'];
type EnableLogging = Norbix['hub']['logs']['enableLogging'];
type DeleteLoggingIntegration = Norbix['hub']['logs']['deleteLoggingIntegration'];
type DisableLoggingIntegration = Norbix['hub']['logs']['disableLoggingIntegration'];
type EnableLoggingIntegration = Norbix['hub']['logs']['enableLoggingIntegration'];
type GetLoggingIntegration = Norbix['hub']['logs']['getLoggingIntegration'];
type GetLoggingIntegrations = Norbix['hub']['logs']['getLoggingIntegrations'];
type SaveLoggingIntegration = Norbix['hub']['logs']['saveLoggingIntegration'];
type TestLoggingIntegration = Norbix['hub']['logs']['testLoggingIntegration'];
type GetLogsByCorrelationId = Norbix['hub']['logs']['getLogsByCorrelationId'];

/**
 * `hub.logs` — 10 endpoints, 1:1 with the core SDK.
 */
export const hubLogs = (b: Builder) => ({
  disableLogging: b.mutation<Result<DisableLogging>, Arg<DisableLogging>>({
    query: (args) => (norbix) => norbix.hub.logs.disableLogging(args),
    invalidatesTags: ['Logs'],
  }),

  enableLogging: b.mutation<Result<EnableLogging>, Arg<EnableLogging>>({
    query: (args) => (norbix) => norbix.hub.logs.enableLogging(args),
    invalidatesTags: ['Logs'],
  }),

  deleteLoggingIntegration: b.mutation<Result<DeleteLoggingIntegration>, Arg<DeleteLoggingIntegration>>({
    query: (args) => (norbix) => norbix.hub.logs.deleteLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  disableLoggingIntegration: b.mutation<Result<DisableLoggingIntegration>, Arg<DisableLoggingIntegration>>({
    query: (args) => (norbix) => norbix.hub.logs.disableLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  enableLoggingIntegration: b.mutation<Result<EnableLoggingIntegration>, Arg<EnableLoggingIntegration>>({
    query: (args) => (norbix) => norbix.hub.logs.enableLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  getLoggingIntegration: b.query<Result<GetLoggingIntegration>, Arg<GetLoggingIntegration>>({
    query: (args) => (norbix) => norbix.hub.logs.getLoggingIntegration(args),
    providesTags: ['LogsIntegrations'],
  }),

  getLoggingIntegrations: b.query<Result<GetLoggingIntegrations>, Arg<GetLoggingIntegrations>>({
    query: (args) => (norbix) => norbix.hub.logs.getLoggingIntegrations(args),
    providesTags: ['LogsIntegrations'],
  }),

  saveLoggingIntegration: b.mutation<Result<SaveLoggingIntegration>, Arg<SaveLoggingIntegration>>({
    query: (args) => (norbix) => norbix.hub.logs.saveLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  testLoggingIntegration: b.mutation<Result<TestLoggingIntegration>, Arg<TestLoggingIntegration>>({
    query: (args) => (norbix) => norbix.hub.logs.testLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  getLogsByCorrelationId: b.query<Result<GetLogsByCorrelationId>, Arg<GetLogsByCorrelationId>>({
    query: (args) => (norbix) => norbix.hub.logs.getLogsByCorrelationId(args),
    providesTags: ['Logs'],
  }),
});
