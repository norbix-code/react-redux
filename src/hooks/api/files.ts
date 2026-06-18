// AUTO-GENERATED — full coverage of `norbix.api.files` (8 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

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

/**
 * `api.files` — 8 endpoints, 1:1 with the core SDK.
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
});
