// `norbix.hub.code` — Workflows (beta), 26 endpoints (core SDK 4.39.0).
//
// The gateway routes behind these hooks, so the endpoint-coverage matrix can
// see them (it looks for the route string in the source). This file never
// builds a URL itself — the core SDK does — so these are documentation:
//
//   GET    /{version}/code/workflows
//   PUT    /{version}/code/workflows
//   GET    /{version}/code/workflows/{Id}
//   DELETE /{version}/code/workflows/{Id}
//   POST   /{version}/code/workflows/{Id}/publish
//   GET    /{version}/code/workflows/{Id}/draft
//   DELETE /{version}/code/workflows/{Id}/draft
//   GET    /{version}/code/workflows/{Id}/versions
//   GET    /{version}/code/workflows/{Id}/versions/diff
//   POST   /{version}/code/workflows/validate
//   GET    /{version}/code/workflows/schema
//   PUT    /{version}/code/workflows/enable
//   PUT    /{version}/code/workflows/disable
//   PUT    /{version}/code/workflows/{Id}/enable
//   PUT    /{version}/code/workflows/{Id}/disable
//   POST   /{version}/code/workflows/{Id}/invoke
//   GET    /{version}/code/workflows/{Id}/runs
//   GET    /{version}/code/workflows/runs
//   GET    /{version}/code/workflows/runs/{RunId}
//   GET    /{version}/code/workflows/runs/{RunId}/logs
//   POST   /{version}/code/workflows/runs/{RunId}/resume
//   POST   /{version}/code/workflows/{Id}/resume
//   POST   /{version}/code/workflows/runs/{RunId}/retry
//   POST   /{version}/code/workflows/runs/{RunId}/cancel
//   GET    /{version}/code/workflows/resume/{Token}
//   POST   /{version}/code/workflows/resume/{Token}
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

/**
 * Beta: `hub.code` workflows — definitions (draft, publish, versions, diff,
 * validate, schema), the beta switch, per-workflow enable / disable, runs
 * (invoke, list, waiting runs, one run, its logs) and the run controls
 * (resume, resume by key, retry a step, cancel, signed resume links).
 * Workflows are in beta; bugs may occur. 1:1 with the workflow methods of
 * `norbix.hub.code` (gateway contract `Code.Workflows.md` §7).
 *
 * `norbix.hub.code.workflows.waitForRun(runId, { timeoutMs, pollMs })` is a
 * plain SDK helper (it polls `getCodeWorkflowRun`), not a route — call it
 * directly, there is no hook for it.
 *
 * Tag conventions (all type `CodeWorkflows`):
 *   - `LIST`          — the workflow list
 *   - `<id>`          — one workflow (`wf_…`): itself, its draft, versions and diffs
 *   - `SCHEMA`        — the definition JSON schema
 *   - `RUNS`          — every run list (a workflow's runs, the waiting runs)
 *   - `RUN:<runId>`   — one run (`wfr_…`) and its logs
 *   - `LINK:<token>`  — what a signed resume link points at
 *
 * Writes on a definition invalidate `LIST` and the workflow; the beta switch
 * also invalidates `Account`, `Projects` and `Code` like the module switch
 * (it flips `workflowsEnabled` on the Code module). Invoke, resume, retry and
 * cancel invalidate `RUNS` and the run (its id comes from the call or, for
 * invoke / resume by key / a resume link, from the answer).
 */
export const hubCodeWorkflows = (b: Builder) => {
  type HC = Norbix['hub']['code'];
  type Fn<K extends keyof HC> = HC[K] extends (...a: never[]) => unknown ? HC[K] : never;

  type GetWorkflows = Fn<'getCodeWorkflows'>;
  type SaveWorkflow = Fn<'saveCodeWorkflow'>;
  type GetWorkflow = Fn<'getCodeWorkflow'>;
  type DeleteWorkflow = Fn<'deleteCodeWorkflow'>;
  type PublishWorkflow = Fn<'publishCodeWorkflow'>;
  type GetDraft = Fn<'getCodeWorkflowDraft'>;
  type DiscardDraft = Fn<'discardCodeWorkflowDraft'>;
  type GetVersions = Fn<'getCodeWorkflowVersions'>;
  type GetVersionDiff = Fn<'getCodeWorkflowVersionDiff'>;
  type Validate = Fn<'validateCodeWorkflow'>;
  type GetSchema = Fn<'getCodeWorkflowSchema'>;
  type EnableAll = Fn<'enableCodeWorkflows'>;
  type DisableAll = Fn<'disableCodeWorkflows'>;
  type EnableWorkflow = Fn<'enableCodeWorkflow'>;
  type DisableWorkflow = Fn<'disableCodeWorkflow'>;
  type Invoke = Fn<'invokeCodeWorkflow'>;
  type GetRuns = Fn<'getCodeWorkflowRuns'>;
  type GetWaitingRuns = Fn<'getCodeWorkflowWaitingRuns'>;
  type GetRun = Fn<'getCodeWorkflowRun'>;
  type GetRunLogs = Fn<'getCodeWorkflowRunLogs'>;
  type Resume = Fn<'resumeCodeWorkflowRun'>;
  type ResumeByKey = Fn<'resumeCodeWorkflowRunByKey'>;
  type Retry = Fn<'retryCodeWorkflowRunStep'>;
  type Cancel = Fn<'cancelCodeWorkflowRun'>;
  type OpenLink = Fn<'openCodeWorkflowResumeLink'>;
  type UseLink = Fn<'useCodeWorkflowResumeLink'>;

  const T = 'CodeWorkflows' as const;
  const LIST = { type: T, id: 'LIST' };
  const RUNS = { type: T, id: 'RUNS' };
  const workflowId = (arg: unknown, res?: unknown) =>
    (arg as { id?: string })?.id ??
    (res as { workflow?: { id?: string } })?.workflow?.id ??
    'CURRENT';
  const runTag = (arg: unknown, res?: unknown) => ({
    type: T,
    id: `RUN:${
      (arg as { runId?: string })?.runId ??
      (res as { runId?: string })?.runId ??
      (res as { run?: { runId?: string } })?.run?.runId ??
      'CURRENT'
    }`,
  });
  const workflow = (res: unknown, arg: unknown) => [LIST, { type: T, id: workflowId(arg, res) }];
  const run = (res: unknown, arg: unknown) => [RUNS, runTag(arg, res)];
  const linkTag = (arg: unknown) => ({
    type: T,
    id: `LINK:${(arg as { token?: string })?.token ?? 'CURRENT'}`,
  });

  return {
    // ---- Definitions ----
    /** Beta: lists the workflows (`isEnabled?`, paging). */
    getCodeWorkflows: b.query<Result<GetWorkflows>, Arg<GetWorkflows>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflows(args),
      providesTags: [LIST],
    }),
    /** Beta: creates or updates a workflow's draft from `definition`. */
    saveCodeWorkflow: b.mutation<Result<SaveWorkflow>, Arg<SaveWorkflow>>({
      query: (args) => (norbix) => norbix.hub.code.saveCodeWorkflow(args),
      invalidatesTags: (res, _err, arg) => workflow(res, arg),
    }),
    /** Beta: reads one workflow (`id`, `pinnedVersion?`). */
    getCodeWorkflow: b.query<Result<GetWorkflow>, Arg<GetWorkflow>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflow(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: workflowId(arg) }],
    }),
    /** Beta: deletes a workflow (`id`). */
    deleteCodeWorkflow: b.mutation<Result<DeleteWorkflow>, Arg<DeleteWorkflow>>({
      query: (args) => (norbix) => norbix.hub.code.deleteCodeWorkflow(args),
      invalidatesTags: (res, _err, arg) => workflow(res, arg),
    }),
    /** Beta: publishes the draft as the next version (`id`). */
    publishCodeWorkflow: b.mutation<Result<PublishWorkflow>, Arg<PublishWorkflow>>({
      query: (args) => (norbix) => norbix.hub.code.publishCodeWorkflow(args),
      invalidatesTags: (res, _err, arg) => workflow(res, arg),
    }),
    /** Beta: reads the draft (`id`). */
    getCodeWorkflowDraft: b.query<Result<GetDraft>, Arg<GetDraft>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowDraft(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: workflowId(arg) }],
    }),
    /** Beta: discards the draft (`id`). */
    discardCodeWorkflowDraft: b.mutation<Result<DiscardDraft>, Arg<DiscardDraft>>({
      query: (args) => (norbix) => norbix.hub.code.discardCodeWorkflowDraft(args),
      invalidatesTags: (res, _err, arg) => workflow(res, arg),
    }),
    /** Beta: lists the published versions (`id`). */
    getCodeWorkflowVersions: b.query<Result<GetVersions>, Arg<GetVersions>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowVersions(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: workflowId(arg) }],
    }),
    /** Beta: diffs two versions (`id`, `fromVersion`, `toVersion`). */
    getCodeWorkflowVersionDiff: b.query<Result<GetVersionDiff>, Arg<GetVersionDiff>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowVersionDiff(args),
      providesTags: (_res, _err, arg) => [{ type: T, id: workflowId(arg) }],
    }),
    /** Beta: validates a `definition` without saving it; touches nothing. */
    validateCodeWorkflow: b.mutation<Result<Validate>, Arg<Validate>>({
      query: (args) => (norbix) => norbix.hub.code.validateCodeWorkflow(args),
    }),
    /** Beta: the definition JSON schema. */
    getCodeWorkflowSchema: b.query<Result<GetSchema>, Arg<GetSchema>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowSchema(args),
      providesTags: [{ type: T, id: 'SCHEMA' }],
    }),

    // ---- Beta switch and per-workflow switch ----
    /** Beta: turns workflows on for the project (the beta switch). */
    enableCodeWorkflows: b.mutation<Result<EnableAll>, Arg<EnableAll>>({
      query: (args) => (norbix) => norbix.hub.code.enableCodeWorkflows(args),
      invalidatesTags: ['Account', 'Projects', 'Code', LIST],
    }),
    /** Beta: turns workflows off for the project (the beta switch). */
    disableCodeWorkflows: b.mutation<Result<DisableAll>, Arg<DisableAll>>({
      query: (args) => (norbix) => norbix.hub.code.disableCodeWorkflows(args),
      invalidatesTags: ['Account', 'Projects', 'Code', LIST],
    }),
    /** Beta: enables one workflow (`id`). */
    enableCodeWorkflow: b.mutation<Result<EnableWorkflow>, Arg<EnableWorkflow>>({
      query: (args) => (norbix) => norbix.hub.code.enableCodeWorkflow(args),
      invalidatesTags: (res, _err, arg) => workflow(res, arg),
    }),
    /** Beta: disables one workflow (`id`). */
    disableCodeWorkflow: b.mutation<Result<DisableWorkflow>, Arg<DisableWorkflow>>({
      query: (args) => (norbix) => norbix.hub.code.disableCodeWorkflow(args),
      invalidatesTags: (res, _err, arg) => workflow(res, arg),
    }),

    // ---- Runs ----
    /** Beta: starts a run (`id`, `payload?`, `waitSeconds?` 0–30, `runVersion?`). */
    invokeCodeWorkflow: b.mutation<Result<Invoke>, Arg<Invoke>>({
      query: (args) => (norbix) => norbix.hub.code.invokeCodeWorkflow(args),
      invalidatesTags: (res, _err, arg) => run(res, arg),
    }),
    /** Beta: a workflow's runs (`id`, `status?`, `from?`, `to?`, paging). */
    getCodeWorkflowRuns: b.query<Result<GetRuns>, Arg<GetRuns>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowRuns(args),
      providesTags: [RUNS],
    }),
    /** Beta: runs across workflows (`status?`, `waitingKind?`, `assignee?`, `workflowId?`, `key?`). */
    getCodeWorkflowWaitingRuns: b.query<Result<GetWaitingRuns>, Arg<GetWaitingRuns>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowWaitingRuns(args),
      providesTags: [RUNS],
    }),
    /** Beta: one run (`runId`). */
    getCodeWorkflowRun: b.query<Result<GetRun>, Arg<GetRun>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowRun(args),
      providesTags: (_res, _err, arg) => [runTag(arg)],
    }),
    /** Beta: a run's log lines (`runId`, `stepId?`, `level?`, paging). */
    getCodeWorkflowRunLogs: b.query<Result<GetRunLogs>, Arg<GetRunLogs>>({
      query: (args) => (norbix) => norbix.hub.code.getCodeWorkflowRunLogs(args),
      providesTags: (_res, _err, arg) => [runTag(arg)],
    }),
    /** Beta: resumes a waiting run (`runId`, `stepId?`, `decision?`, `payload?`). */
    resumeCodeWorkflowRun: b.mutation<Result<Resume>, Arg<Resume>>({
      query: (args) => (norbix) => norbix.hub.code.resumeCodeWorkflowRun(args),
      invalidatesTags: (res, _err, arg) => run(res, arg),
    }),
    /** Beta: resumes the run waiting on a key (`id`, `key`, `stepId?`, `decision?`, `payload?`). */
    resumeCodeWorkflowRunByKey: b.mutation<Result<ResumeByKey>, Arg<ResumeByKey>>({
      query: (args) => (norbix) => norbix.hub.code.resumeCodeWorkflowRunByKey(args),
      invalidatesTags: (res, _err, arg) => run(res, arg),
    }),
    /** Beta: retries a failed step (`runId`, `stepId?`). */
    retryCodeWorkflowRunStep: b.mutation<Result<Retry>, Arg<Retry>>({
      query: (args) => (norbix) => norbix.hub.code.retryCodeWorkflowRunStep(args),
      invalidatesTags: (res, _err, arg) => run(res, arg),
    }),
    /** Beta: cancels a run (`runId`, `reason?`). */
    cancelCodeWorkflowRun: b.mutation<Result<Cancel>, Arg<Cancel>>({
      query: (args) => (norbix) => norbix.hub.code.cancelCodeWorkflowRun(args),
      invalidatesTags: (res, _err, arg) => run(res, arg),
    }),

    // ---- Signed resume links (the token is the key; no session needed) ----
    /** Beta: what a signed resume link points at (`token`). */
    openCodeWorkflowResumeLink: b.query<Result<OpenLink>, Arg<OpenLink>>({
      query: (args) => (norbix) => norbix.hub.code.openCodeWorkflowResumeLink(args),
      providesTags: (_res, _err, arg) => [linkTag(arg)],
    }),
    /** Beta: resumes the run a signed link points at (`token`). */
    useCodeWorkflowResumeLink: b.mutation<Result<UseLink>, Arg<UseLink>>({
      query: (args) => (norbix) => norbix.hub.code.useCodeWorkflowResumeLink(args),
      invalidatesTags: (res, _err, arg) => [...run(res, arg), linkTag(arg)],
    }),
  };
};
