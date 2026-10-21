// Full coverage of `norbix.hub.logs` (15 endpoints), 1:1 with the core SDK.
// Written by hand: this repo has no hook sync script (the header used to say
// "re-run the hook sync"; there is none — add a row here for a new SDK method).
import type { Norbix } from '@norbix.ai/ts';

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
type GetLogs = Norbix['hub']['logs']['getLogs'];
type GetLog = Norbix['hub']['logs']['getLog'];
type CleanLogs = Norbix['hub']['logs']['cleanLogs'];
type GetLogSettings = Norbix['hub']['logs']['getLogSettings'];
type SaveLogSettings = Norbix['hub']['logs']['saveLogSettings'];

/**
 * `hub.logs` — 15 endpoints, 1:1 with the core SDK.
 *
 * Tags:
 *   - `Logs`             — log entries and the module switch.
 *   - `LogsSettings`     — the project's log settings.
 *   - `LogsIntegrations` — logging integrations. Nothing is delivered to an
 *     integration until its last test passed: call `testLoggingIntegration`
 *     after every `saveLoggingIntegration`.
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

  deleteLoggingIntegration: b.mutation<
    Result<DeleteLoggingIntegration>,
    Arg<DeleteLoggingIntegration>
  >({
    query: (args) => (norbix) => norbix.hub.logs.deleteLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  disableLoggingIntegration: b.mutation<
    Result<DisableLoggingIntegration>,
    Arg<DisableLoggingIntegration>
  >({
    query: (args) => (norbix) => norbix.hub.logs.disableLoggingIntegration(args),
    invalidatesTags: ['LogsIntegrations'],
  }),

  enableLoggingIntegration: b.mutation<
    Result<EnableLoggingIntegration>,
    Arg<EnableLoggingIntegration>
  >({
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

  getLogs: b.query<Result<GetLogs>, Arg<GetLogs>>({
    query: (args) => (norbix) => norbix.hub.logs.getLogs(args),
    providesTags: ['Logs'],
  }),

  /** Arg: `{ id }` — the id of a `getLogs` row. */
  getLog: b.query<Result<GetLog>, Arg<GetLog>>({
    query: (args) => (norbix) => norbix.hub.logs.getLog(args),
    providesTags: ['Logs'],
  }),

  /** Deletes every entry stored in the project's Norbix Logging. */
  cleanLogs: b.mutation<Result<CleanLogs>, Arg<CleanLogs>>({
    query: (args) => (norbix) => norbix.hub.logs.cleanLogs(args),
    invalidatesTags: ['Logs'],
  }),

  getLogSettings: b.query<Result<GetLogSettings>, Arg<GetLogSettings>>({
    query: (args) => (norbix) => norbix.hub.logs.getLogSettings(args),
    providesTags: ['LogsSettings'],
  }),

  /** Only the settings you send change; a field left out keeps its value. */
  saveLogSettings: b.mutation<Result<SaveLogSettings>, Arg<SaveLogSettings>>({
    query: (args) => (norbix) => norbix.hub.logs.saveLogSettings(args),
    invalidatesTags: ['LogsSettings'],
  }),
});
