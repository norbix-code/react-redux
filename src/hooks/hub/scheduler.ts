import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

/**
 * `hub.scheduler` — module on/off plus task CRUD. Scheduler tasks are the
 * highest-traffic part of this surface in admin UIs (cron-like jobs:
 * email campaigns, custom code, etc.).
 *
 * Tag conventions:
 *   - `Scheduler/LIST`        — task list
 *   - `Scheduler/<taskId>`    — single task
 */
export const hubScheduler = (b: Builder) => {
  type HS = Norbix['hub']['scheduler'];

  type EnableModule = HS['enableScheduler'] extends (...a: never[]) => unknown
    ? HS['enableScheduler']
    : never;
  type DisableModule = HS['disableScheduler'] extends (...a: never[]) => unknown
    ? HS['disableScheduler']
    : never;

  type GetTasks = HS['getSchedulerTasks'] extends (...a: never[]) => unknown
    ? HS['getSchedulerTasks']
    : never;
  type GetTask = HS['getSchedulerTask'] extends (...a: never[]) => unknown
    ? HS['getSchedulerTask']
    : never;
  type SaveTask = HS['saveSchedulerTask'] extends (...a: never[]) => unknown
    ? HS['saveSchedulerTask']
    : never;
  type EnableTask = HS['enableSchedulerTask'] extends (...a: never[]) => unknown
    ? HS['enableSchedulerTask']
    : never;
  type DisableTask = HS['disableSchedulerTask'] extends (...a: never[]) => unknown
    ? HS['disableSchedulerTask']
    : never;
  type DeleteTask = HS['deleteSchedulerTask'] extends (...a: never[]) => unknown
    ? HS['deleteSchedulerTask']
    : never;

  const callHS = (norbix: Norbix) => norbix.hub.scheduler as HS;

  return {
    // ---- Module toggle ----
    enableSchedulerModule: b.mutation<Result<EnableModule>, Arg<EnableModule>>({
      query: (args) => (norbix) => callHS(norbix).enableScheduler(args),
      invalidatesTags: ['Account', 'Projects', 'Scheduler'],
    }),
    disableSchedulerModule: b.mutation<Result<DisableModule>, Arg<DisableModule>>({
      query: (args) => (norbix) => callHS(norbix).disableScheduler(args),
      invalidatesTags: ['Account', 'Projects', 'Scheduler'],
    }),

    // ---- Tasks ----
    getSchedulerTasks: b.query<Result<GetTasks>, Arg<GetTasks>>({
      query: (args) => (norbix) => callHS(norbix).getSchedulerTasks(args),
      providesTags: [{ type: 'Scheduler', id: 'LIST' }],
    }),

    getSchedulerTask: b.query<Result<GetTask>, Arg<GetTask>>({
      query: (args) => (norbix) => callHS(norbix).getSchedulerTask(args),
      providesTags: (_res, _err, arg) => [
        { type: 'Scheduler', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),

    saveSchedulerTask: b.mutation<Result<SaveTask>, Arg<SaveTask>>({
      query: (args) => (norbix) => callHS(norbix).saveSchedulerTask(args),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Scheduler', id: 'LIST' },
        { type: 'Scheduler', id: (arg as { taskId?: string })?.taskId ?? 'CURRENT' },
      ],
    }),

    enableSchedulerTask: b.mutation<Result<EnableTask>, Arg<EnableTask>>({
      query: (args) => (norbix) => callHS(norbix).enableSchedulerTask(args),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Scheduler', id: 'LIST' },
        { type: 'Scheduler', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),

    disableSchedulerTask: b.mutation<Result<DisableTask>, Arg<DisableTask>>({
      query: (args) => (norbix) => callHS(norbix).disableSchedulerTask(args),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Scheduler', id: 'LIST' },
        { type: 'Scheduler', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),

    deleteSchedulerTask: b.mutation<Result<DeleteTask>, Arg<DeleteTask>>({
      query: (args) => (norbix) => callHS(norbix).deleteSchedulerTask(args),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Scheduler', id: 'LIST' },
        { type: 'Scheduler', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      ],
    }),
  } as const;
};
