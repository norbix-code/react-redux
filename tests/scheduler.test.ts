import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { URL } from 'node:url';

import { Norbix } from '@norbix.ai/ts';
import { describe, expect, it, vi } from 'vitest';

import { createNorbixBaseQuery } from '../src/baseQuery.js';
import { hubScheduler } from '../src/hooks/hub/scheduler.js';

/**
 * The scheduler hooks — the 8 scheduler Hub endpoints of the core SDK. The
 * hooks are a 1:1 wrapper, so the contract is: the hook reaches the right SDK
 * method with the caller's arguments, is a query or a mutation as expected,
 * and carries the cache tags the dashboard relies on. The last describe drives
 * the real `@norbix.ai/ts` client with a fake fetch — never a real server.
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

/** hook name → [kind, SDK method on norbix.hub.scheduler]. */
const SCHEDULER: Record<string, ['query' | 'mutation', string]> = {
  enableSchedulerModule: ['mutation', 'enableScheduler'],
  disableSchedulerModule: ['mutation', 'disableScheduler'],
  getSchedulerTasks: ['query', 'getSchedulerTasks'],
  getSchedulerTask: ['query', 'getSchedulerTask'],
  saveSchedulerTask: ['mutation', 'saveSchedulerTask'],
  enableSchedulerTask: ['mutation', 'enableSchedulerTask'],
  disableSchedulerTask: ['mutation', 'disableSchedulerTask'],
  deleteSchedulerTask: ['mutation', 'deleteSchedulerTask'],
};
const NAMES = Object.keys(SCHEDULER);

function fakeNorbix() {
  const calls: Array<{ method: string; args: unknown }> = [];
  const record = (method: string) => (args: unknown) => {
    calls.push({ method, args });
    return Promise.resolve({ ok: true });
  };
  const scheduler = Object.fromEntries(
    NAMES.map((n) => [SCHEDULER[n]![1], record(SCHEDULER[n]![1])]),
  );
  return { calls, client: { hub: { scheduler } } };
}

function tagsFor(tags: Tags | undefined, arg: unknown): unknown {
  return typeof tags === 'function' ? tags(undefined, undefined, arg) : tags;
}

const endpoints = hubScheduler(fakeBuilder()) as unknown as Record<string, Def>;

/** A typed EmailCampaign task, as the dashboard sends it. */
const saveArgs = {
  taskId: 'tsk_1',
  name: 'Weekly digest',
  cron: '0 9 * * 1',
  initiatorUserId: 'usr_1',
  isEnabled: true,
  stopOnError: false,
  task: {
    type: 'EmailCampaign',
    campaign: { source: 'AllUsers', templateId: 'tpl_1' },
  },
};

describe('hubScheduler', () => {
  it('covers all 8 scheduler endpoints of the core SDK', () => {
    expect(Object.keys(endpoints).sort()).toEqual([...NAMES].sort());
  });

  it.each(NAMES)('%s reaches the matching SDK method with the caller args', async (key) => {
    const { calls, client } = fakeNorbix();
    const args = key === 'saveSchedulerTask' ? saveArgs : { id: 'tsk_1' };

    await endpoints[key]!.query(args)(client);

    expect(calls).toEqual([{ method: SCHEDULER[key]![1], args }]);
  });

  it.each(NAMES)('%s is a %s', (key) => {
    expect(endpoints[key]!.__kind).toBe(SCHEDULER[key]![0]);
  });

  it('module switch invalidates Account, Projects and Scheduler', () => {
    for (const key of ['enableSchedulerModule', 'disableSchedulerModule']) {
      expect(tagsFor(endpoints[key]!.invalidatesTags, undefined)).toEqual([
        'Account',
        'Projects',
        'Scheduler',
      ]);
    }
  });

  it('the task list provides Scheduler/LIST; one task provides Scheduler/<id>', () => {
    expect(tagsFor(endpoints['getSchedulerTasks']!.providesTags, {})).toEqual([
      { type: 'Scheduler', id: 'LIST' },
    ]);
    expect(tagsFor(endpoints['getSchedulerTask']!.providesTags, { id: 'tsk_1' })).toEqual([
      { type: 'Scheduler', id: 'tsk_1' },
    ]);
  });

  it.each(['enableSchedulerTask', 'disableSchedulerTask', 'deleteSchedulerTask'])(
    '%s invalidates the list and the task',
    (key) => {
      expect(tagsFor(endpoints[key]!.invalidatesTags, { id: 'tsk_1' })).toEqual([
        { type: 'Scheduler', id: 'LIST' },
        { type: 'Scheduler', id: 'tsk_1' },
      ]);
    },
  );

  it('saveSchedulerTask invalidates the list and the saved task (taskId), or CURRENT on create', () => {
    const tags = endpoints['saveSchedulerTask']!.invalidatesTags;
    expect(tagsFor(tags, saveArgs)).toEqual([
      { type: 'Scheduler', id: 'LIST' },
      { type: 'Scheduler', id: 'tsk_1' },
    ]);
    expect(tagsFor(tags, { ...saveArgs, taskId: undefined })).toEqual([
      { type: 'Scheduler', id: 'LIST' },
      { type: 'Scheduler', id: 'CURRENT' },
    ]);
  });
});

/** The installed core SDK. Module enable / disable became PUT in 4.6.0. */
const sdkVersion = (
  JSON.parse(readFileSync(resolve(cwd(), 'node_modules/@norbix.ai/ts/package.json'), 'utf8')) as {
    version: string;
  }
).version;
const [major = 0, minor = 0] = sdkVersion.split('.').map(Number);
const sdkSendsModulePut = major > 4 || (major === 4 && minor >= 6);

/**
 * Through the real `@norbix.ai/ts` client and this package's base query with a
 * fake fetch: verb, route with the id substituted, where the fields go, and
 * the project scope headers.
 */
describe('scheduler hooks through the real SDK (fake fetch)', () => {
  function run(key: string, args: unknown) {
    // Only globalThis.* here: the lint config declares no DOM globals.
    type FetchFn = typeof globalThis.fetch;
    const seen: Array<{
      url: string;
      method: string;
      body: string | undefined;
      headers: InstanceType<typeof globalThis.Headers>;
    }> = [];
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
      bearerToken: 'test-token',
      projectId: 'test-project',
      apiVersion: 'v2',
      hubVersion: 'v2',
      baseUrl: { api: 'https://api.norbix.io', hub: 'https://hub.norbix.io' },
      fetch: fetchImpl,
    });
    const baseQuery = createNorbixBaseQuery(() => norbix);
    const result = baseQuery(endpoints[key]!.query(args) as never, {} as never, {});
    return { seen, result };
  }

  const HUB = 'https://hub.norbix.io/v2';

  it.skipIf(!sdkSendsModulePut).each([
    ['enableSchedulerModule', `${HUB}/scheduler/enable`],
    ['disableSchedulerModule', `${HUB}/scheduler/disable`],
  ])('%s sends PUT %s (core SDK 4.6.0+)', async (key, url) => {
    const { seen, result } = run(key, undefined);
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('PUT');
    expect(seen[0]!.url).toBe(url);
    expect(seen[0]!.body).toBeUndefined();
  });

  it.each([
    ['getSchedulerTask', 'GET', `${HUB}/scheduler/tasks/tsk_1`],
    ['enableSchedulerTask', 'PUT', `${HUB}/scheduler/tasks/tsk_1/enable`],
    ['disableSchedulerTask', 'PUT', `${HUB}/scheduler/tasks/tsk_1/disable`],
    ['deleteSchedulerTask', 'DELETE', `${HUB}/scheduler/tasks/tsk_1`],
  ])('%s sends %s %s with the id in the path', async (key, method, url) => {
    const { seen, result } = run(key, { id: 'tsk_1' });
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen).toHaveLength(1);
    expect(seen[0]!.method).toBe(method);
    expect(seen[0]!.url).toBe(url);
    expect(seen[0]!.body).toBeUndefined();
    expect(seen[0]!.headers.get('Authorization')).toBe('Bearer test-token');
    expect(seen[0]!.headers.get('X-CM-ProjectId')).toBe('test-project');
  });

  it('getSchedulerTasks sends GET /v2/scheduler/tasks with the filters in the query string', async () => {
    const { seen, result } = run('getSchedulerTasks', { type: 'EmailCampaign', enabled: true });
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    const url = new URL(seen[0]!.url);
    expect(seen[0]!.method).toBe('GET');
    expect(`${url.origin}${url.pathname}`).toBe(`${HUB}/scheduler/tasks`);
    expect(url.searchParams.get('type')).toBe('EmailCampaign');
    expect(url.searchParams.get('enabled')).toBe('true');
  });

  it('saveSchedulerTask sends POST /v2/scheduler/tasks with the EmailCampaign task in the JSON body', async () => {
    const { seen, result } = run('saveSchedulerTask', saveArgs);
    expect(((await result) as { error?: unknown }).error).toBeUndefined();
    expect(seen[0]!.method).toBe('POST');
    expect(seen[0]!.url).toBe(`${HUB}/scheduler/tasks`);
    expect(JSON.parse(seen[0]!.body!)).toEqual(saveArgs);
  });
});
