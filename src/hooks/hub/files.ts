// AUTO-GENERATED — full coverage of `norbix.hub.files` (22 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
//
// The gateway routes behind these hooks, so the endpoint-coverage matrix can
// see them (it looks for the route string in the source). This file never
// builds a URL itself — the core SDK does — so these are documentation:
//
//   GET    /{version}/files/enable
//   GET    /{version}/files/disable
//   GET    /{version}/files/folder
//   GET    /{version}/files/item
//   POST   /{version}/files/item/public
//   POST   /{version}/files/item/private
//   POST   /{version}/files/folder/public
//   POST   /{version}/files/folder/private
//   GET    /{version}/files/integrations
//   POST   /{version}/files/integrations
//   POST   /{version}/files/integrations/test
//   GET    /{version}/files/integrations/{id}
//   DELETE /{version}/files/integrations/{Id}
//   PUT    /{version}/files/integrations/{Id}/enable
//   PUT    /{version}/files/integrations/{Id}/disable
//   PUT    /{version}/files/integrations/{Id}/default
//   GET    /{version}/files/triggers
//   POST   /{version}/files/triggers
//   GET    /{version}/files/triggers/{id}
//   DELETE /{version}/files/triggers/{triggerId}
//   PATCH  /{version}/files/triggers/{triggerId}/enable
//   PATCH  /{version}/files/triggers/{triggerId}/disable
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
type TestFilesIntegration = Norbix['hub']['files']['testFilesIntegration'];
type MakeFilePublic = Norbix['hub']['files']['makeFilePublic'];
type MakeFilePrivate = Norbix['hub']['files']['makeFilePrivate'];
type MakeFolderPublic = Norbix['hub']['files']['makeFolderPublic'];
type MakeFolderPrivate = Norbix['hub']['files']['makeFolderPrivate'];

/**
 * `hub.files` — 22 endpoints, 1:1 with the core SDK.
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

  /**
   * Tries an integration's credentials against the storage provider and
   * answers whether they work. Nothing is saved, so nothing is invalidated —
   * call it before `saveFilesIntegration` to tell a bad key from a bad
   * bucket. A mutation rather than a query because it is an action with a
   * side effect on the provider, and its answer must never be served from
   * cache.
   */
  testFilesIntegration: b.mutation<Result<TestFilesIntegration>, Arg<TestFilesIntegration>>({
    query: (args) => (norbix) => norbix.hub.files.testFilesIntegration(args),
  }),

  /**
   * Makes one file readable by anyone holding its link. Answers with the
   * `nbpf_…` public id; the link itself arrives on the file's `publicUrl`
   * the next time the listing is read — which is why this invalidates
   * `Files`.
   */
  makeFilePublic: b.mutation<Result<MakeFilePublic>, Arg<MakeFilePublic>>({
    query: (args) => (norbix) => norbix.hub.files.makeFilePublic(args),
    invalidatesTags: ['Files'],
  }),

  /**
   * Takes a file's public link away. Refused while a folder above the file
   * is public — switch the folder off instead.
   */
  makeFilePrivate: b.mutation<Result<MakeFilePrivate>, Arg<MakeFilePrivate>>({
    query: (args) => (norbix) => norbix.hub.files.makeFilePrivate(args),
    invalidatesTags: ['Files'],
  }),

  /**
   * Publishes a whole folder prefix — one record, however many files sit
   * under it, at any depth. Every file underneath changes its `isPublic`,
   * so the whole `Files` tag goes.
   */
  makeFolderPublic: b.mutation<Result<MakeFolderPublic>, Arg<MakeFolderPublic>>({
    query: (args) => (norbix) => norbix.hub.files.makeFolderPublic(args),
    invalidatesTags: ['Files'],
  }),

  /** Takes back every link inside the folder, including per-file ones. */
  makeFolderPrivate: b.mutation<Result<MakeFolderPrivate>, Arg<MakeFolderPrivate>>({
    query: (args) => (norbix) => norbix.hub.files.makeFolderPrivate(args),
    invalidatesTags: ['Files'],
  }),

});
