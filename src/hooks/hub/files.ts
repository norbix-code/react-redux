import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type EnableFiles = Norbix['hub']['files']['enableFiles'];
type DisableFiles = Norbix['hub']['files']['disableFiles'];

/**
 * `hub.files` — module on/off + (extend yourself) integrations & triggers.
 * Most file-storage admin lives behind these toggles plus integration CRUD;
 * for the integrations subset, follow the canonical pattern from
 * `hub.database` (`getXIntegrations`, `getXIntegration`, `saveXIntegration`,
 * etc.) — same tag id `INTEGRATIONS_LIST` for the list.
 */
export const hubFiles = (b: Builder) => ({
  enableFiles: b.mutation<Result<EnableFiles>, Arg<EnableFiles>>({
    query: (args) => (norbix) => norbix.hub.files.enableFiles(args),
    invalidatesTags: ['Account', 'Projects', 'Files'],
  }),

  disableFiles: b.mutation<Result<DisableFiles>, Arg<DisableFiles>>({
    query: (args) => (norbix) => norbix.hub.files.disableFiles(args),
    invalidatesTags: ['Account', 'Projects', 'Files'],
  }),
});
