// Full coverage of `norbix.api.ai` (16 endpoints) — the end-user AI chat for a
// signed-in project user. Synced from the norbix core SDK surface.
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type GetEndUserChatAvailability = Norbix['api']['ai']['getEndUserChatAvailability'];
type ListEndUserChatSessions = Norbix['api']['ai']['listEndUserChatSessions'];
type CreateEndUserChatSession = Norbix['api']['ai']['createEndUserChatSession'];
type GetEndUserChatSession = Norbix['api']['ai']['getEndUserChatSession'];
type RenameEndUserChatSession = Norbix['api']['ai']['renameEndUserChatSession'];
type DeleteEndUserChatSession = Norbix['api']['ai']['deleteEndUserChatSession'];
type PinEndUserChatSession = Norbix['api']['ai']['pinEndUserChatSession'];
type ArchiveEndUserChatSession = Norbix['api']['ai']['archiveEndUserChatSession'];
type GetEndUserChatEntries = Norbix['api']['ai']['getEndUserChatEntries'];
type SetEndUserChatEntryFeedback = Norbix['api']['ai']['setEndUserChatEntryFeedback'];
type ListEndUserChatAttachments = Norbix['api']['ai']['listEndUserChatAttachments'];
type UploadEndUserChatAttachment = Norbix['api']['ai']['uploadEndUserChatAttachment'];
type DeleteEndUserChatAttachment = Norbix['api']['ai']['deleteEndUserChatAttachment'];
type ListEndUserChatMemory = Norbix['api']['ai']['listEndUserChatMemory'];
type ForgetEndUserChatMemory = Norbix['api']['ai']['forgetEndUserChatMemory'];
type StartEndUserChatTurn = Norbix['api']['ai']['startEndUserChatTurn'];

/**
 * `api.ai` — 16 endpoints, 1:1 with the core SDK.
 *
 * `startEndUserChatTurn` answers at once with a `turnId`; tokens, tool calls
 * and the final answer arrive on the user's SSE channel
 * `ai-chat:{projectId}:{authId}` — open it with `norbix.aiChat({ authId })`
 * from `@norbix.ai/ts` (a foreign channel is refused with 403
 * `AiChatChannelRefused` and the client does not retry). Every mutation
 * invalidates `AiChat`, so session and entry lists refresh.
 */
export const apiAi = (b: Builder) => ({
  getEndUserChatAvailability: b.query<
    Result<GetEndUserChatAvailability>,
    Arg<GetEndUserChatAvailability>
  >({
    query: (args) => (norbix) => norbix.api.ai.getEndUserChatAvailability(args),
    providesTags: ['AiChat'],
  }),

  listEndUserChatSessions: b.query<Result<ListEndUserChatSessions>, Arg<ListEndUserChatSessions>>({
    query: (args) => (norbix) => norbix.api.ai.listEndUserChatSessions(args),
    providesTags: ['AiChat'],
  }),

  createEndUserChatSession: b.mutation<
    Result<CreateEndUserChatSession>,
    Arg<CreateEndUserChatSession>
  >({
    query: (args) => (norbix) => norbix.api.ai.createEndUserChatSession(args),
    invalidatesTags: ['AiChat'],
  }),

  getEndUserChatSession: b.query<Result<GetEndUserChatSession>, Arg<GetEndUserChatSession>>({
    query: (args) => (norbix) => norbix.api.ai.getEndUserChatSession(args),
    providesTags: ['AiChat'],
  }),

  renameEndUserChatSession: b.mutation<
    Result<RenameEndUserChatSession>,
    Arg<RenameEndUserChatSession>
  >({
    query: (args) => (norbix) => norbix.api.ai.renameEndUserChatSession(args),
    invalidatesTags: ['AiChat'],
  }),

  deleteEndUserChatSession: b.mutation<
    Result<DeleteEndUserChatSession>,
    Arg<DeleteEndUserChatSession>
  >({
    query: (args) => (norbix) => norbix.api.ai.deleteEndUserChatSession(args),
    invalidatesTags: ['AiChat'],
  }),

  pinEndUserChatSession: b.mutation<Result<PinEndUserChatSession>, Arg<PinEndUserChatSession>>({
    query: (args) => (norbix) => norbix.api.ai.pinEndUserChatSession(args),
    invalidatesTags: ['AiChat'],
  }),

  archiveEndUserChatSession: b.mutation<
    Result<ArchiveEndUserChatSession>,
    Arg<ArchiveEndUserChatSession>
  >({
    query: (args) => (norbix) => norbix.api.ai.archiveEndUserChatSession(args),
    invalidatesTags: ['AiChat'],
  }),

  getEndUserChatEntries: b.query<Result<GetEndUserChatEntries>, Arg<GetEndUserChatEntries>>({
    query: (args) => (norbix) => norbix.api.ai.getEndUserChatEntries(args),
    providesTags: ['AiChat'],
  }),

  setEndUserChatEntryFeedback: b.mutation<
    Result<SetEndUserChatEntryFeedback>,
    Arg<SetEndUserChatEntryFeedback>
  >({
    query: (args) => (norbix) => norbix.api.ai.setEndUserChatEntryFeedback(args),
    invalidatesTags: ['AiChat'],
  }),

  listEndUserChatAttachments: b.query<
    Result<ListEndUserChatAttachments>,
    Arg<ListEndUserChatAttachments>
  >({
    query: (args) => (norbix) => norbix.api.ai.listEndUserChatAttachments(args),
    providesTags: ['AiChat'],
  }),

  uploadEndUserChatAttachment: b.mutation<
    Result<UploadEndUserChatAttachment>,
    Arg<UploadEndUserChatAttachment>
  >({
    query: (args) => (norbix) => norbix.api.ai.uploadEndUserChatAttachment(args),
    invalidatesTags: ['AiChat'],
  }),

  deleteEndUserChatAttachment: b.mutation<
    Result<DeleteEndUserChatAttachment>,
    Arg<DeleteEndUserChatAttachment>
  >({
    query: (args) => (norbix) => norbix.api.ai.deleteEndUserChatAttachment(args),
    invalidatesTags: ['AiChat'],
  }),

  listEndUserChatMemory: b.query<Result<ListEndUserChatMemory>, Arg<ListEndUserChatMemory>>({
    query: (args) => (norbix) => norbix.api.ai.listEndUserChatMemory(args),
    providesTags: ['AiChat'],
  }),

  forgetEndUserChatMemory: b.mutation<
    Result<ForgetEndUserChatMemory>,
    Arg<ForgetEndUserChatMemory>
  >({
    query: (args) => (norbix) => norbix.api.ai.forgetEndUserChatMemory(args),
    invalidatesTags: ['AiChat'],
  }),

  startEndUserChatTurn: b.mutation<Result<StartEndUserChatTurn>, Arg<StartEndUserChatTurn>>({
    query: (args) => (norbix) => norbix.api.ai.startEndUserChatTurn(args),
    invalidatesTags: ['AiChat'],
  }),
});
