import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Result } from '../types.js';

type Push = Norbix['notifications']['push'];
type RegisterDevice = Push['registerDevice'];
type ListDevices = Push['listDevices'];
type RemoveDevice = Push['removeDevice'];
type RemoveDeviceByToken = Push['removeDeviceByToken'];
type ListMessages = Push['listMessages'];
type MarkMessageRead = Push['markMessageRead'];
type MarkAllMessagesRead = Push['markAllMessagesRead'];

/**
 * `notifications.push` — push for the signed-in project user (API host, user
 * token), 1:1 with `norbix.notifications.push.*` in the core SDK.
 *
 * Tags:
 *   - `PushDevices`  — the user's registered devices.
 *   - `PushMessages` — the user's push messages (read state included).
 */
export const apiPush = (b: Builder) => ({
  registerPushDevice: b.mutation<Result<RegisterDevice>, Parameters<RegisterDevice>[0]>({
    query: (device) => (norbix) => norbix.notifications.push.registerDevice(device),
    invalidatesTags: ['PushDevices'],
  }),

  listPushDevices: b.query<Result<ListDevices>, void>({
    query: () => (norbix) => norbix.notifications.push.listDevices(),
    providesTags: ['PushDevices'],
  }),

  /** Arg: the device id (`pnd_…`). */
  removePushDevice: b.mutation<Result<RemoveDevice>, string>({
    query: (id) => (norbix) => norbix.notifications.push.removeDevice(id),
    invalidatesTags: ['PushDevices'],
  }),

  /** Arg: the push token the device was registered with (e.g. on sign-out). */
  removePushDeviceByToken: b.mutation<Result<RemoveDeviceByToken>, string>({
    query: (token) => (norbix) => norbix.notifications.push.removeDeviceByToken(token),
    invalidatesTags: ['PushDevices'],
  }),

  listPushMessages: b.query<Result<ListMessages>, Parameters<ListMessages>[0] | void>({
    query: (args) => (norbix) => norbix.notifications.push.listMessages(args ?? {}),
    providesTags: ['PushMessages'],
  }),

  /** Arg: the message id. */
  markPushMessageRead: b.mutation<Result<MarkMessageRead>, string>({
    query: (id) => (norbix) => norbix.notifications.push.markMessageRead(id),
    invalidatesTags: ['PushMessages'],
  }),

  markAllPushMessagesRead: b.mutation<Result<MarkAllMessagesRead>, void>({
    query: () => (norbix) => norbix.notifications.push.markAllMessagesRead(),
    invalidatesTags: ['PushMessages'],
  }),
});
