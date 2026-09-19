// AUTO-GENERATED — full coverage of `norbix.api.files` (10 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
//
// The gateway routes behind these hooks, so the endpoint-coverage matrix can
// see them (it looks for the route string in the source). This file never
// builds a URL itself — the core SDK does — so these are documentation:
//
//   GET    /{version}/files/{filesIntegrationId}
//   DELETE /{version}/files/{filesIntegrationId}
//   DELETE /{version}/files/{filesIntegrationId}/bulk
//   POST   /{version}/files/{filesIntegrationId}/commit
//   GET    /{version}/files/{filesIntegrationId}/download
//   GET    /{version}/files/{filesIntegrationId}/info
//   GET    /{version}/files/{filesIntegrationId}/sign
//   POST   /{version}/files/{filesIntegrationId}/upload-url
//   POST   /{version}/files/{filesIntegrationId}/test
//   GET    /{version}/files/public/{PublicId}/{Name*}
import type { Norbix } from '@norbix.ai/ts';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type CommitUpload = Norbix['api']['files']['commitUpload'];
type DeleteFileApi = Norbix['api']['files']['deleteFileApi'];
type DeleteManyFilesApi = Norbix['api']['files']['deleteManyFilesApi'];
type DownloadFileApi = Norbix['api']['files']['downloadFileApi'];
type GetFileInfo = Norbix['api']['files']['getFileInfo'];
type GetSignedUrl = Norbix['api']['files']['getSignedUrl'];
type ListFiles = Norbix['api']['files']['listFiles'];
type RequestUploadUrl = Norbix['api']['files']['requestUploadUrl'];
type GetPublicFile = Norbix['api']['files']['getPublicFile'];
type TestFilesIntegrationApi = Norbix['api']['files']['testFilesIntegration'];

/**
 * `api.files` — 10 endpoints, 1:1 with the core SDK.
 */
export const apiFiles = (b: Builder) => ({
  commitUpload: b.mutation<Result<CommitUpload>, Arg<CommitUpload>>({
    query: (args) => (norbix) => norbix.api.files.commitUpload(args),
    invalidatesTags: ['Files'],
  }),

  deleteFileApi: b.mutation<Result<DeleteFileApi>, Arg<DeleteFileApi>>({
    query: (args) => (norbix) => norbix.api.files.deleteFileApi(args),
    invalidatesTags: ['Files'],
  }),

  deleteManyFilesApi: b.mutation<Result<DeleteManyFilesApi>, Arg<DeleteManyFilesApi>>({
    query: (args) => (norbix) => norbix.api.files.deleteManyFilesApi(args),
    invalidatesTags: ['Files'],
  }),

  downloadFileApi: b.query<Result<DownloadFileApi>, Arg<DownloadFileApi>>({
    query: (args) => (norbix) => norbix.api.files.downloadFileApi(args),
    providesTags: ['Files'],
  }),

  getFileInfo: b.query<Result<GetFileInfo>, Arg<GetFileInfo>>({
    query: (args) => (norbix) => norbix.api.files.getFileInfo(args),
    providesTags: ['Files'],
  }),

  getSignedUrl: b.query<Result<GetSignedUrl>, Arg<GetSignedUrl>>({
    query: (args) => (norbix) => norbix.api.files.getSignedUrl(args),
    providesTags: ['Files'],
  }),

  listFiles: b.query<Result<ListFiles>, Arg<ListFiles>>({
    query: (args) => (norbix) => norbix.api.files.listFiles(args),
    providesTags: ['Files'],
  }),

  requestUploadUrl: b.mutation<Result<RequestUploadUrl>, Arg<RequestUploadUrl>>({
    query: (args) => (norbix) => norbix.api.files.requestUploadUrl(args),
    invalidatesTags: ['Files'],
  }),

  /**
   * Reads a file somebody published from the Hub side. The one Files call
   * that carries no credentials at all — the link has to work in an e-mail,
   * in an `<img src>`, or in a browser on a stranger's phone.
   *
   * Answers with the file's raw bytes (`Uint8Array`), not JSON.
   *
   * Cached under its own `id` rather than the plain `Files` tag: the bytes
   * belong to the public link, and are keyed by the id + name a caller asked
   * for. Making the file private again invalidates `Files`, which is a
   * different tag, so a stale cache entry here is possible — call
   * `refetch()` when that matters to you.
   */
  getPublicFile: b.query<Result<GetPublicFile>, Arg<GetPublicFile>>({
    query: (args) => (norbix) => norbix.api.files.getPublicFile(args),
    providesTags: (_res, _err, arg) => [
      { type: 'Files' as const, id: `PUBLIC:${arg?.publicId ?? 'unknown'}` },
    ],
  }),

  /**
   * Runs a live probe against a files integration with the caller's own API
   * key or session: uploads a small file, reads it, lists the folder and
   * deletes the file again. Answers one item per step (`UploadFile`,
   * `GetFile`, `GetAllFiles`, `DeleteFile`) with `result` `OK`, `FAILED` or
   * `NOT_TESTED`, plus the step's `errors`. Needs the `files:create`
   * permission, because the probe writes to the storage.
   *
   * Wraps `api.files.testFilesIntegration`
   * (`POST /{version}/files/{filesIntegrationId}/test`). This is NOT the
   * dashboard endpoint `hub.files.testFilesIntegration`
   * (`POST /{version}/files/integrations/test`), whose hook is
   * `useTestFilesIntegrationMutation`. Both live in one flat endpoint map,
   * so this one carries the `Api` suffix — the same way `deleteFileApi` and
   * `downloadFileApi` do — otherwise the Hub one, spread later, would
   * silently replace it. Hook: `useTestFilesIntegrationApiMutation`.
   *
   * A mutation, like every other write in this file, so its answer is never
   * served from cache. It invalidates:
   * - `Files`, like its write neighbours: the probe uploads and deletes a
   *   real file in the storage `listFiles` reads, and if the delete step
   *   fails the probe file stays behind;
   * - `FilesIntegrations`: the gateway records the outcome on the
   *   integration (last test time, success, errors), which
   *   `getFilesIntegration(s)` return.
   */
  testFilesIntegrationApi: b.mutation<
    Result<TestFilesIntegrationApi>,
    Arg<TestFilesIntegrationApi>
  >({
    query: (args) => (norbix) => norbix.api.files.testFilesIntegration(args),
    invalidatesTags: ['Files', 'FilesIntegrations'],
  }),
});
