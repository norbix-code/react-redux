// AUTO-GENERATED — full coverage of `norbix.hub.files` (17 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type DisableFiles = Norbix['hub']['files']['disableFiles'];
type EnableFiles = Norbix['hub']['files']['enableFiles'];
type DeleteFilesTrigger = Norbix['hub']['files']['deleteFilesTrigger'];
type DisableFilesTrigger = Norbix['hub']['files']['disableFilesTrigger'];
type EnableFilesTrigger = Norbix['hub']['files']['enableFilesTrigger'];
type GetFilesTrigger = Norbix['hub']['files']['getFilesTrigger'];
type GetFilesTriggers = Norbix['hub']['files']['getFilesTriggers'];
type SaveFilesTrigger = Norbix['hub']['files']['saveFilesTrigger'];
type DeleteFilesIntegration = Norbix['hub']['files']['deleteFilesIntegration'];
type DisableFilesIntegration = Norbix['hub']['files']['disableFilesIntegration'];
type EnableFilesIntegration = Norbix['hub']['files']['enableFilesIntegration'];
type GetFilesIntegration = Norbix['hub']['files']['getFilesIntegration'];
type GetFilesIntegrations = Norbix['hub']['files']['getFilesIntegrations'];
type SaveFilesIntegration = Norbix['hub']['files']['saveFilesIntegration'];
type SetFilesIntegrationAsDefault = Norbix['hub']['files']['setFilesIntegrationAsDefault'];
type GetFile = Norbix['hub']['files']['getFile'];
type GetFolderFiles = Norbix['hub']['files']['getFolderFiles'];

/**
 * `hub.files` — 17 endpoints, 1:1 with the core SDK.
 */
export const hubFiles = (b: Builder) => ({
  disableFiles: b.mutation<Result<DisableFiles>, Arg<DisableFiles>>({
    query: (args) => (norbix) => norbix.hub.files.disableFiles(args),
    invalidatesTags: ['Files'],
  }),

  enableFiles: b.mutation<Result<EnableFiles>, Arg<EnableFiles>>({
    query: (args) => (norbix) => norbix.hub.files.enableFiles(args),
    invalidatesTags: ['Files'],
  }),

  deleteFilesTrigger: b.mutation<Result<DeleteFilesTrigger>, Arg<DeleteFilesTrigger>>({
    query: (args) => (norbix) => norbix.hub.files.deleteFilesTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  disableFilesTrigger: b.mutation<Result<DisableFilesTrigger>, Arg<DisableFilesTrigger>>({
    query: (args) => (norbix) => norbix.hub.files.disableFilesTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  enableFilesTrigger: b.mutation<Result<EnableFilesTrigger>, Arg<EnableFilesTrigger>>({
    query: (args) => (norbix) => norbix.hub.files.enableFilesTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  getFilesTrigger: b.query<Result<GetFilesTrigger>, Arg<GetFilesTrigger>>({
    query: (args) => (norbix) => norbix.hub.files.getFilesTrigger(args),
    providesTags: ['Triggers'],
  }),

  getFilesTriggers: b.query<Result<GetFilesTriggers>, Arg<GetFilesTriggers>>({
    query: (args) => (norbix) => norbix.hub.files.getFilesTriggers(args),
    providesTags: ['Triggers'],
  }),

  saveFilesTrigger: b.mutation<Result<SaveFilesTrigger>, Arg<SaveFilesTrigger>>({
    query: (args) => (norbix) => norbix.hub.files.saveFilesTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  deleteFilesIntegration: b.mutation<Result<DeleteFilesIntegration>, Arg<DeleteFilesIntegration>>({
    query: (args) => (norbix) => norbix.hub.files.deleteFilesIntegration(args),
    invalidatesTags: ['FilesIntegrations'],
  }),

  disableFilesIntegration: b.mutation<Result<DisableFilesIntegration>, Arg<DisableFilesIntegration>>({
    query: (args) => (norbix) => norbix.hub.files.disableFilesIntegration(args),
    invalidatesTags: ['FilesIntegrations'],
  }),

  enableFilesIntegration: b.mutation<Result<EnableFilesIntegration>, Arg<EnableFilesIntegration>>({
    query: (args) => (norbix) => norbix.hub.files.enableFilesIntegration(args),
    invalidatesTags: ['FilesIntegrations'],
  }),

  getFilesIntegration: b.query<Result<GetFilesIntegration>, Arg<GetFilesIntegration>>({
    query: (args) => (norbix) => norbix.hub.files.getFilesIntegration(args),
    providesTags: ['FilesIntegrations'],
  }),

  getFilesIntegrations: b.query<Result<GetFilesIntegrations>, Arg<GetFilesIntegrations>>({
    query: (args) => (norbix) => norbix.hub.files.getFilesIntegrations(args),
    providesTags: ['FilesIntegrations'],
  }),

  saveFilesIntegration: b.mutation<Result<SaveFilesIntegration>, Arg<SaveFilesIntegration>>({
    query: (args) => (norbix) => norbix.hub.files.saveFilesIntegration(args),
    invalidatesTags: ['FilesIntegrations'],
  }),

  setFilesIntegrationAsDefault: b.mutation<Result<SetFilesIntegrationAsDefault>, Arg<SetFilesIntegrationAsDefault>>({
    query: (args) => (norbix) => norbix.hub.files.setFilesIntegrationAsDefault(args),
    invalidatesTags: ['FilesIntegrations'],
  }),

  getFile: b.query<Result<GetFile>, Arg<GetFile>>({
    query: (args) => (norbix) => norbix.hub.files.getFile(args),
    providesTags: ['Files'],
  }),

  getFolderFiles: b.query<Result<GetFolderFiles>, Arg<GetFolderFiles>>({
    query: (args) => (norbix) => norbix.hub.files.getFolderFiles(args),
    providesTags: ['Files'],
  }),
});
