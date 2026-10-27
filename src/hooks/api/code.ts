// `norbix.api.code` — Workflows (beta) for your app's users, 4 endpoints
// (core SDK 4.39.0).
//
// The gateway routes behind these hooks, so the endpoint-coverage matrix can
// see them (it looks for the route string in the source). This file never
// builds a URL itself — the core SDK does — so these are documentation:
//
//   GET    /{version}/code/workflows/runs
//   POST   /{version}/code/workflows/runs/{RunId}/resume
//   GET    /{version}/code/workflows/resume/{Token}
//   POST   /{version}/code/workflows/resume/{Token}
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetWaitingRuns = Norbix['api']['code']['getCodeWorkflowWaitingRuns'];
type Resume = Norbix['api']['code']['resumeCodeWorkflowRun'];
type OpenLink = Norbix['api']['code']['openCodeWorkflowResumeLink'];
type UseLink = Norbix['api']['code']['useCodeWorkflowResumeLink'];

const T = 'CodeWorkflows' as const;
const RUNS = { type: T, id: 'RUNS' };
const runTag = (arg: unknown, res?: unknown) => ({
  type: T,
  id: `RUN:${
    (arg as { runId?: string })?.runId ??
    (res as { run?: { runId?: string } })?.run?.runId ??
    'CURRENT'
  }`,
});
const linkTag = (arg: unknown) => ({
  type: T,
  id: `LINK:${(arg as { token?: string })?.token ?? 'CURRENT'}`,
});

/**
 * Beta: `api.code` — the workflow runs waiting on a person (an approval or an
 * input), resuming one, and the signed resume links sent by e-mail. Workflows
 * are in beta; bugs may occur. 1:1 with `norbix.api.code`.
 *
 * Every hook carries the `Api` suffix: the Hub has methods of the same names
 * (`hub.code`) and both live in one endpoint map (like
 * `useTestFilesIntegrationApiMutation`).
 *
 * The resume links need no session: the token in the link is the key. The
 * core SDK sends them with an optional scope — the bearer and project id when
 * the client has them, no failure when it has none.
 *
 * Tags (type `CodeWorkflows`, shared with the Hub hooks): `RUNS` for the run
 * lists, `RUN:<runId>` for one run, `LINK:<token>` for a link. A resume
 * invalidates `RUNS` and the run.
 */
export const apiCode = (b: Builder) => ({
  /** Beta: runs waiting on someone (`status?`, `waitingKind?`, `assignee?` — `me` or `usr_…`, `workflowId?`, `key?`, paging). */
  getCodeWorkflowWaitingRunsApi: b.query<Result<GetWaitingRuns>, Arg<GetWaitingRuns>>({
    query: (args) => (norbix) => norbix.api.code.getCodeWorkflowWaitingRuns(args),
    providesTags: [RUNS],
  }),

  /** Beta: resumes a waiting run (`runId`, `stepId?`, `decision?` — `approved` / `rejected`, `payload?`). */
  resumeCodeWorkflowRunApi: b.mutation<Result<Resume>, Arg<Resume>>({
    query: (args) => (norbix) => norbix.api.code.resumeCodeWorkflowRun(args),
    invalidatesTags: (res, _err, arg) => [RUNS, runTag(arg, res)],
  }),

  /** Beta: what a signed resume link points at (`token`): the run, step, mode and expiry. */
  openCodeWorkflowResumeLinkApi: b.query<Result<OpenLink>, Arg<OpenLink>>({
    query: (args) => (norbix) => norbix.api.code.openCodeWorkflowResumeLink(args),
    providesTags: (_res, _err, arg) => [linkTag(arg)],
  }),

  /** Beta: resumes the run a signed link points at (`token`). */
  useCodeWorkflowResumeLinkApi: b.mutation<Result<UseLink>, Arg<UseLink>>({
    query: (args) => (norbix) => norbix.api.code.useCodeWorkflowResumeLink(args),
    invalidatesTags: (res, _err, arg) => [RUNS, runTag(arg, res), linkTag(arg)],
  }),
});
