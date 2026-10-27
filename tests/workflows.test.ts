import { URL } from 'node:url';

import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { apiCode } from '../src/hooks/api/code.js';
import { hubCodeWorkflows } from '../src/hooks/hub/workflows.js';
import { buildEndpoints } from '../src/hooks/index.js';

/**
 * The Workflows (beta) hooks: 26 on `hub.code`, 4 on `api.code` (gateway
 * contract Code.Workflows.md §7, core SDK 4.39.0). The hooks are a 1:1
 * wrapper, so the contract is: each hook reaches the right SDK method with
 * the caller's arguments, is a query or a mutation as expected, carries the
 * cache tags, and — through the real `@norbix.ai/ts` client with a fake
 * fetch, never a real server — sends the verb, the path with the ids filled
 * in, and the fields in the query string (GET / DELETE) or the JSON body
 * (POST / PUT).
 */
function fakeBuilder() {
  return {
    query: (def: Record<string, unknown>) => ({ ...def, __kind: 'query' }),
    mutation: (def: Record<string, unknown>) => ({ ...def, __kind: 'mutation' }),
  } as never;
}

type Tags = unknown[] | ((res: unknown, err: unknown, arg: unknown) => unknown[]);

type Def = {
  __kind: 'query' | 'mutation';
  query: (args: unknown) => (norbix: unknown) => unknown;
  providesTags?: Tags;
  invalidatesTags?: Tags;
};

type Case = [
  string,
  'query' | 'mutation',
  string,
  string,
  Record<string, unknown>,
  Record<string, unknown>,
];

const WF = 'wf_6Qp1dW2kRm8NsT4vYc0Hb';
const RUN = 'wfr_4hT2b9QkLm3XcT1yRfGh7a';
const TOKEN = 'rl_3kLm9QwErTyU0aSdFgHjKl';
const W = `/code/workflows/${WF}`;
const R = `/code/workflows/runs/${RUN}`;
const DEFINITION = { name: 'Order approval', steps: [{ id: 'approve', type: 'approval' }] };

/** hook → kind, verb, path after /v2, the caller's args, the fields that must go on the wire. */
const HUB_CASES: Case[] = [
  [
    'getCodeWorkflows',
    'query',
    'GET',
    '/code/workflows',
    { isEnabled: true, pageSize: 20 },
    { isEnabled: true, pageSize: 20 },
  ],
  [
    'saveCodeWorkflow',
    'mutation',
    'PUT',
    '/code/workflows',
    { definition: DEFINITION },
    { definition: DEFINITION },
  ],
  ['getCodeWorkflow', 'query', 'GET', W, { id: WF, pinnedVersion: 3 }, { pinnedVersion: 3 }],
  ['deleteCodeWorkflow', 'mutation', 'DELETE', W, { id: WF }, {}],
  ['publishCodeWorkflow', 'mutation', 'POST', `${W}/publish`, { id: WF }, {}],
  ['getCodeWorkflowDraft', 'query', 'GET', `${W}/draft`, { id: WF }, {}],
  ['discardCodeWorkflowDraft', 'mutation', 'DELETE', `${W}/draft`, { id: WF }, {}],
  ['getCodeWorkflowVersions', 'query', 'GET', `${W}/versions`, { id: WF }, {}],
  [
    'getCodeWorkflowVersionDiff',
    'query',
    'GET',
    `${W}/versions/diff`,
    { id: WF, fromVersion: 1, toVersion: 2 },
    { fromVersion: 1, toVersion: 2 },
  ],
  [
    'validateCodeWorkflow',
    'mutation',
    'POST',
    '/code/workflows/validate',
    { definition: DEFINITION },
    { definition: DEFINITION },
  ],
  ['getCodeWorkflowSchema', 'query', 'GET', '/code/workflows/schema', {}, {}],
  ['enableCodeWorkflows', 'mutation', 'PUT', '/code/workflows/enable', {}, {}],
  ['disableCodeWorkflows', 'mutation', 'PUT', '/code/workflows/disable', {}, {}],
  ['enableCodeWorkflow', 'mutation', 'PUT', `${W}/enable`, { id: WF }, {}],
  ['disableCodeWorkflow', 'mutation', 'PUT', `${W}/disable`, { id: WF }, {}],
  [
    'invokeCodeWorkflow',
    'mutation',
    'POST',
    `${W}/invoke`,
    { id: WF, payload: { orderId: 'ord_1' }, waitSeconds: 5, runVersion: 'draft' },
    { payload: { orderId: 'ord_1' }, waitSeconds: 5, runVersion: 'draft' },
  ],
  [
    'getCodeWorkflowRuns',
    'query',
    'GET',
    `${W}/runs`,
    { id: WF, status: 'failed', from: '2026-10-01', to: '2026-10-27', pageSize: 10 },
    { status: 'failed', from: '2026-10-01', to: '2026-10-27', pageSize: 10 },
  ],
  [
    'getCodeWorkflowWaitingRuns',
    'query',
    'GET',
    '/code/workflows/runs',
    { status: 'waiting', waitingKind: 'approval', assignee: 'me', workflowId: WF, key: 'ord_1' },
    { status: 'waiting', waitingKind: 'approval', assignee: 'me', workflowId: WF, key: 'ord_1' },
  ],
  ['getCodeWorkflowRun', 'query', 'GET', R, { runId: RUN }, {}],
  [
    'getCodeWorkflowRunLogs',
    'query',
    'GET',
    `${R}/logs`,
    { runId: RUN, stepId: 'approve', level: 'Error', pageSize: 50 },
    { stepId: 'approve', level: 'Error', pageSize: 50 },
  ],
  [
    'resumeCodeWorkflowRun',
    'mutation',
    'POST',
    `${R}/resume`,
    { runId: RUN, stepId: 'approve', decision: 'approved', payload: { note: 'ok' } },
    { stepId: 'approve', decision: 'approved', payload: { note: 'ok' } },
  ],
  [
    'resumeCodeWorkflowRunByKey',
    'mutation',
    'POST',
    `${W}/resume`,
    { id: WF, key: 'ord_1', stepId: 'approve', decision: 'rejected', payload: { why: 'stock' } },
    { key: 'ord_1', stepId: 'approve', decision: 'rejected', payload: { why: 'stock' } },
  ],
  [
    'retryCodeWorkflowRunStep',
    'mutation',
    'POST',
    `${R}/retry`,
    { runId: RUN, stepId: 'charge' },
    { stepId: 'charge' },
  ],
  [
    'cancelCodeWorkflowRun',
    'mutation',
    'POST',
    `${R}/cancel`,
    { runId: RUN, reason: 'duplicate' },
    { reason: 'duplicate' },
  ],
  [
    'openCodeWorkflowResumeLink',
    'query',
    'GET',
    `/code/workflows/resume/${TOKEN}`,
    { token: TOKEN },
    {},
  ],
  [
    'useCodeWorkflowResumeLink',
    'mutation',
    'POST',
    `/code/workflows/resume/${TOKEN}`,
    { token: TOKEN },
    {},
  ],
];

/** Same shape for the 4 `api.code` hooks; the SDK method is the key without `Api`. */
const API_CASES: Case[] = [
  [
    'getCodeWorkflowWaitingRunsApi',
    'query',
    'GET',
    '/code/workflows/runs',
    { assignee: 'me', waitingKind: 'input', pageSize: 10 },
    { assignee: 'me', waitingKind: 'input', pageSize: 10 },
  ],
  [
    'resumeCodeWorkflowRunApi',
    'mutation',
    'POST',
    `${R}/resume`,
    { runId: RUN, decision: 'approved', payload: { note: 'ok' } },
    { decision: 'approved', payload: { note: 'ok' } },
  ],
  [
    'openCodeWorkflowResumeLinkApi',
    'query',
    'GET',
    `/code/workflows/resume/${TOKEN}`,
    { token: TOKEN },
    {},
  ],
  [
    'useCodeWorkflowResumeLinkApi',
    'mutation',
    'POST',
    `/code/workflows/resume/${TOKEN}`,
    { token: TOKEN },
    {},
  ],
];

const sdkName = (key: string) => key.replace(/Api$/, '');

function tagsFor(tags: Tags | undefined, arg: unknown, res?: unknown): unknown {
  return typeof tags === 'function' ? tags(res, undefined, arg) : tags;
}

const hub = hubCodeWorkflows(fakeBuilder()) as unknown as Record<string, Def>;
const api = apiCode(fakeBuilder()) as unknown as Record<string, Def>;

const tag = (id: string) => ({ type: 'CodeWorkflows', id });

describe('hubCodeWorkflows / apiCode', () => {
  it('wraps the 26 workflow methods of hub.code and the 4 of api.code', () => {
    expect(Object.keys(hub).sort()).toEqual(HUB_CASES.map((c) => c[0]).sort());
    expect(Object.keys(api).sort()).toEqual(API_CASES.map((c) => c[0]).sort());
  });

  it('the api hooks keep their own keys in the one endpoint map (no hub name overwritten)', () => {
    const all = buildEndpoints(fakeBuilder()) as unknown as Record<string, Def>;
    for (const key of [...HUB_CASES, ...API_CASES].map((c) => c[0])) {
      expect(all[key], key).toBeDefined();
    }
    expect(all['getCodeWorkflowWaitingRuns']).not.toBe(all['getCodeWorkflowWaitingRunsApi']);
  });

  it.each(HUB_CASES.map((c) => [c[0], c[1]] as const))(
    'hub %s is a %s and reaches hub.code of the same name with the caller args',
    async (key, kind) => {
      expect(hub[key]!.__kind).toBe(kind);
      const calls: Array<{ method: string; args: unknown }> = [];
      const code = {
        [key]: (args: unknown) => (calls.push({ method: key, args }), Promise.resolve({})),
      };
      const args = { id: WF, runId: RUN, marker: key };
      await hub[key]!.query(args)({ hub: { code } });
      expect(calls).toEqual([{ method: key, args }]);
    },
  );

  it.each(API_CASES.map((c) => [c[0], c[1]] as const))(
    'api %s is a %s and reaches api.code without the Api suffix',
    async (key, kind) => {
      expect(api[key]!.__kind).toBe(kind);
      const calls: Array<{ method: string; args: unknown }> = [];
      const method = sdkName(key);
      const code = {
        [method]: (args: unknown) => (calls.push({ method, args }), Promise.resolve({})),
      };
      const args = { runId: RUN, marker: key };
      await api[key]!.query(args)({ api: { code } });
      expect(calls).toEqual([{ method, args }]);
    },
  );

  it('definition reads provide LIST, the workflow id or SCHEMA', () => {
    expect(tagsFor(hub['getCodeWorkflows']!.providesTags, {})).toEqual([tag('LIST')]);
    for (const key of [
      'getCodeWorkflow',
      'getCodeWorkflowDraft',
      'getCodeWorkflowVersions',
      'getCodeWorkflowVersionDiff',
    ]) {
      expect(tagsFor(hub[key]!.providesTags, { id: WF }), key).toEqual([tag(WF)]);
    }
    expect(tagsFor(hub['getCodeWorkflowSchema']!.providesTags, {})).toEqual([tag('SCHEMA')]);
  });

  it('definition writes invalidate the list and the workflow', () => {
    for (const key of [
      'publishCodeWorkflow',
      'discardCodeWorkflowDraft',
      'deleteCodeWorkflow',
      'enableCodeWorkflow',
      'disableCodeWorkflow',
    ]) {
      expect(tagsFor(hub[key]!.invalidatesTags, { id: WF }), key).toEqual([tag('LIST'), tag(WF)]);
    }
    // A save carries only the definition: the workflow id comes from the answer.
    expect(
      tagsFor(
        hub['saveCodeWorkflow']!.invalidatesTags,
        { definition: DEFINITION },
        { workflow: { id: WF } },
      ),
    ).toEqual([tag('LIST'), tag(WF)]);
  });

  it('the beta switch invalidates the Code module like the module switch, and the list', () => {
    for (const key of ['enableCodeWorkflows', 'disableCodeWorkflows']) {
      expect(hub[key]!.invalidatesTags).toEqual(['Account', 'Projects', 'Code', tag('LIST')]);
    }
  });

  it('validate invalidates nothing', () => {
    expect(hub['validateCodeWorkflow']!.invalidatesTags).toBeUndefined();
  });

  it('run reads provide RUNS or RUN:<runId>', () => {
    for (const key of ['getCodeWorkflowRuns', 'getCodeWorkflowWaitingRuns']) {
      expect(tagsFor(hub[key]!.providesTags, { id: WF })).toEqual([tag('RUNS')]);
    }
    expect(tagsFor(api['getCodeWorkflowWaitingRunsApi']!.providesTags, {})).toEqual([tag('RUNS')]);
    for (const key of ['getCodeWorkflowRun', 'getCodeWorkflowRunLogs']) {
      expect(tagsFor(hub[key]!.providesTags, { runId: RUN })).toEqual([tag(`RUN:${RUN}`)]);
    }
  });

  it('resume, retry and cancel invalidate RUNS and the run', () => {
    for (const key of [
      'resumeCodeWorkflowRun',
      'retryCodeWorkflowRunStep',
      'cancelCodeWorkflowRun',
    ]) {
      expect(tagsFor(hub[key]!.invalidatesTags, { runId: RUN }), key).toEqual([
        tag('RUNS'),
        tag(`RUN:${RUN}`),
      ]);
    }
    expect(tagsFor(api['resumeCodeWorkflowRunApi']!.invalidatesTags, { runId: RUN })).toEqual([
      tag('RUNS'),
      tag(`RUN:${RUN}`),
    ]);
  });

  it('invoke and resume by key take the run id from the answer', () => {
    expect(tagsFor(hub['invokeCodeWorkflow']!.invalidatesTags, { id: WF }, { runId: RUN })).toEqual(
      [tag('RUNS'), tag(`RUN:${RUN}`)],
    );
    expect(
      tagsFor(
        hub['resumeCodeWorkflowRunByKey']!.invalidatesTags,
        { id: WF, key: 'ord_1' },
        { run: { runId: RUN } },
      ),
    ).toEqual([tag('RUNS'), tag(`RUN:${RUN}`)]);
  });

  it('a resume link provides LINK:<token>; using it invalidates RUNS, the run and the link', () => {
    expect(tagsFor(hub['openCodeWorkflowResumeLink']!.providesTags, { token: TOKEN })).toEqual([
      tag(`LINK:${TOKEN}`),
    ]);
    expect(tagsFor(api['openCodeWorkflowResumeLinkApi']!.providesTags, { token: TOKEN })).toEqual([
      tag(`LINK:${TOKEN}`),
    ]);
    const res = { run: { runId: RUN } };
    for (const [defs, key] of [
      [hub, 'useCodeWorkflowResumeLink'],
      [api, 'useCodeWorkflowResumeLinkApi'],
    ] as const) {
      expect(tagsFor(defs[key]!.invalidatesTags, { token: TOKEN }, res), key).toEqual([
        tag('RUNS'),
        tag(`RUN:${RUN}`),
        tag(`LINK:${TOKEN}`),
      ]);
    }
  });
});

describe('workflow hooks through the real SDK (fake fetch)', () => {
  type FetchFn = typeof globalThis.fetch;
  type Seen = {
    url: string;
    method: string;
    body: string | undefined;
    headers: InstanceType<typeof globalThis.Headers>;
  };

  function run(defs: Record<string, Def>, key: string, args: unknown, signedIn = true) {
    const seen: Seen[] = [];
    const fetchImpl = vi.fn(async (...[input, init]: Parameters<FetchFn>) => {
      seen.push({
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
        body: typeof init?.body === 'string' ? init.body : undefined,
        headers: new globalThis.Headers(init?.headers ?? {}),
      });
      return new globalThis.Response(JSON.stringify({ responseStatus: { isSuccess: true } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as FetchFn;
    const norbix = new Norbix({
      projectId: 'test-project',
      ...(signedIn ? { bearerToken: 'test-token' } : {}),
      apiVersion: 'v2',
      hubVersion: 'v2',
      baseUrl: { api: 'https://api.norbix.io', hub: 'https://hub.norbix.io' },
      fetch: fetchImpl,
    });
    const baseQuery = createNorbixBaseQuery(() => norbix);
    const result = baseQuery(defs[key]!.query(args) as never, {} as never, {});
    return { seen, result };
  }

  async function expectWire(
    seen: Seen[],
    result: unknown,
    origin: string,
    verb: string,
    path: string,
    wire: Record<string, unknown>,
  ) {
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe(verb);
    const url = new URL(seen[0]!.url);
    expect(`${url.origin}${url.pathname}`).toBe(`${origin}${path}`);
    if (verb === 'GET' || verb === 'DELETE') {
      const query = Object.fromEntries(
        [...url.searchParams.entries()].filter(([k]) => k !== 'env'),
      );
      expect(query).toEqual(
        Object.fromEntries(Object.entries(wire).map(([k, v]) => [k, String(v)])),
      );
      expect(seen[0]!.body).toBeUndefined();
    } else {
      expect(url.search).toBe('');
      const body =
        seen[0]!.body === undefined ? {} : (JSON.parse(seen[0]!.body) as Record<string, unknown>);
      expect(body).toEqual(wire);
    }
  }

  it.each(HUB_CASES)('hub %s (%s) sends %s %s', async (key, _kind, verb, path, args, wire) => {
    const { seen, result } = run(hub, key, args);
    await expectWire(seen, result, 'https://hub.norbix.io/v2', verb, path, wire);
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0]!.headers.get('norbix-project-id')).toBe('test-project');
  });

  it.each(API_CASES)('api %s (%s) sends %s %s', async (key, _kind, verb, path, args, wire) => {
    const { seen, result } = run(api, key, args);
    await expectWire(seen, result, 'https://api.norbix.io/v2', verb, path, wire);
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0]!.headers.get('norbix-project-id')).toBe('test-project');
  });

  // The signed links need no session: the token in the link is the key. The core SDK sends
  // them with its optional scope, so a client without a bearer token still calls them.
  // (The `Norbix` constructor always needs a project id, so that header stays.)
  it.each([
    ['hub', 'openCodeWorkflowResumeLink', 'https://hub.norbix.io/v2', 'GET'],
    ['hub', 'useCodeWorkflowResumeLink', 'https://hub.norbix.io/v2', 'POST'],
    ['api', 'openCodeWorkflowResumeLinkApi', 'https://api.norbix.io/v2', 'GET'],
    ['api', 'useCodeWorkflowResumeLinkApi', 'https://api.norbix.io/v2', 'POST'],
  ] as const)('%s %s works with no session (no bearer token)', async (host, key, origin, verb) => {
    const { seen, result } = run(host === 'hub' ? hub : api, key, { token: TOKEN }, false);
    await expectWire(seen, result, origin, verb, `/code/workflows/resume/${TOKEN}`, {});
    expect(seen[0]!.headers.get('Authorization')).toBeNull();
  });
});
