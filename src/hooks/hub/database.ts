import type { Norbix } from 'norbix';

import { buildIntegrationsEndpoints } from '../../helpers/integrations.js';
import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

// Module enable/disable
type EnableDatabase = Norbix['hub']['database']['enableDatabase'];
type DisableDatabase = Norbix['hub']['database']['disableDatabase'];
// Schemas
type GetDatabaseSchemas = Norbix['hub']['database']['getDatabaseSchemas'];
type GetDatabaseSchema = Norbix['hub']['database']['getDatabaseSchema'];
type SaveDatabaseSchema = Norbix['hub']['database']['saveDatabaseSchema'];
type RenameDatabaseSchema = Norbix['hub']['database']['renameDatabaseSchema'];
type DeleteDatabaseSchema = Norbix['hub']['database']['deleteDatabaseSchema'];
type PublishDatabaseSchema = Norbix['hub']['database']['publishDatabaseSchema'];
type GetDatabaseSchemaDraft = Norbix['hub']['database']['getDatabaseSchemaDraft'];
type UpdateDatabaseSchemaDraft = Norbix['hub']['database']['updateDatabaseSchemaDraft'];
type DiscardDatabaseSchemaDraft = Norbix['hub']['database']['discardDatabaseSchemaDraft'];
// Taxonomies
type GetDatabaseTaxonomies = Norbix['hub']['database']['getDatabaseTaxonomies'];
type GetDatabaseTaxonomy = Norbix['hub']['database']['getDatabaseTaxonomy'];
type SaveDatabaseTaxonomy = Norbix['hub']['database']['saveDatabaseTaxonomy'];
type DeleteDatabaseTaxonomy = Norbix['hub']['database']['deleteDatabaseTaxonomy'];
// Aggregates
type GetDatabaseAggregates = Norbix['hub']['database']['getDatabaseAggregates'];
type GetDatabaseAggregate = Norbix['hub']['database']['getDatabaseAggregate'];
type SaveDatabaseAggregate = Norbix['hub']['database']['saveDatabaseAggregate'];
type DeleteDatabaseAggregate = Norbix['hub']['database']['deleteDatabaseAggregate'];

/**
 * `hub.database` — schema, taxonomy, aggregate, and integration management.
 *
 * The integrations subset uses `buildIntegrationsEndpoints` — the same
 * helper that any other Hub *Integrations module can use in one line. See
 * `src/helpers/integrations.ts` for the helper, and the README's
 * "Wire all the *Integrations modules" section for ready-to-paste
 * recipes for email, push, sms, payments, files, code, logs, membership.
 */
export const hubDatabase = (b: Builder) => ({
  // ---- Module toggle ----
  enableDatabase: b.mutation<Result<EnableDatabase>, Arg<EnableDatabase>>({
    query: (args) => (norbix) => norbix.hub.database.enableDatabase(args),
    invalidatesTags: ['Account', 'Projects', 'Database'],
  }),

  disableDatabase: b.mutation<Result<DisableDatabase>, Arg<DisableDatabase>>({
    query: (args) => (norbix) => norbix.hub.database.disableDatabase(args),
    invalidatesTags: ['Account', 'Projects', 'Database'],
  }),

  // ---- Schemas ----
  getDatabaseSchemas: b.query<Result<GetDatabaseSchemas>, Arg<GetDatabaseSchemas>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchemas(args),
    providesTags: [{ type: 'DatabaseSchemas', id: 'LIST' }],
  }),

  getDatabaseSchema: b.query<Result<GetDatabaseSchema>, Arg<GetDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchema(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: (arg as { id?: string })?.id ?? 'CURRENT' },
    ],
  }),

  saveDatabaseSchema: b.mutation<Result<SaveDatabaseSchema>, Arg<SaveDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseSchema(args),
    invalidatesTags: [{ type: 'DatabaseSchemas', id: 'LIST' }],
  }),

  renameDatabaseSchema: b.mutation<Result<RenameDatabaseSchema>, Arg<RenameDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.renameDatabaseSchema(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: 'LIST' },
      { type: 'DatabaseSchemas', id: (arg as { id?: string })?.id ?? 'CURRENT' },
    ],
  }),

  publishDatabaseSchema: b.mutation<Result<PublishDatabaseSchema>, Arg<PublishDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.publishDatabaseSchema(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: 'LIST' },
      { type: 'DatabaseSchemas', id: (arg as { id?: string })?.id ?? 'CURRENT' },
      { type: 'DatabaseCollections' },
    ],
  }),

  deleteDatabaseSchema: b.mutation<Result<DeleteDatabaseSchema>, Arg<DeleteDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseSchema(args),
    invalidatesTags: [
      { type: 'DatabaseSchemas', id: 'LIST' },
      { type: 'DatabaseCollections' },
    ],
  }),

  getDatabaseSchemaDraft: b.query<Result<GetDatabaseSchemaDraft>, Arg<GetDatabaseSchemaDraft>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchemaDraft(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: `DRAFT/${(arg as { id?: string })?.id ?? 'CURRENT'}` },
    ],
  }),

  updateDatabaseSchemaDraft: b.mutation<
    Result<UpdateDatabaseSchemaDraft>,
    Arg<UpdateDatabaseSchemaDraft>
  >({
    query: (args) => (norbix) => norbix.hub.database.updateDatabaseSchemaDraft(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: `DRAFT/${(arg as { id?: string })?.id ?? 'CURRENT'}` },
    ],
  }),

  discardDatabaseSchemaDraft: b.mutation<
    Result<DiscardDatabaseSchemaDraft>,
    Arg<DiscardDatabaseSchemaDraft>
  >({
    query: (args) => (norbix) => norbix.hub.database.discardDatabaseSchemaDraft(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: `DRAFT/${(arg as { id?: string })?.id ?? 'CURRENT'}` },
    ],
  }),

  // ---- Taxonomies ----
  getDatabaseTaxonomies: b.query<Result<GetDatabaseTaxonomies>, Arg<GetDatabaseTaxonomies>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseTaxonomies(args),
    providesTags: [{ type: 'DatabaseTaxonomies', id: 'LIST' }],
  }),

  getDatabaseTaxonomy: b.query<Result<GetDatabaseTaxonomy>, Arg<GetDatabaseTaxonomy>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseTaxonomy(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseTaxonomies', id: (arg as { id?: string })?.id ?? 'CURRENT' },
    ],
  }),

  saveDatabaseTaxonomy: b.mutation<Result<SaveDatabaseTaxonomy>, Arg<SaveDatabaseTaxonomy>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseTaxonomy(args),
    invalidatesTags: [{ type: 'DatabaseTaxonomies', id: 'LIST' }],
  }),

  deleteDatabaseTaxonomy: b.mutation<Result<DeleteDatabaseTaxonomy>, Arg<DeleteDatabaseTaxonomy>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseTaxonomy(args),
    invalidatesTags: [{ type: 'DatabaseTaxonomies', id: 'LIST' }],
  }),

  // ---- Aggregates ----
  getDatabaseAggregates: b.query<Result<GetDatabaseAggregates>, Arg<GetDatabaseAggregates>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseAggregates(args),
    providesTags: [{ type: 'DatabaseAggregates', id: 'LIST' }],
  }),

  getDatabaseAggregate: b.query<Result<GetDatabaseAggregate>, Arg<GetDatabaseAggregate>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseAggregate(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseAggregates', id: (arg as { id?: string })?.id ?? 'CURRENT' },
    ],
  }),

  saveDatabaseAggregate: b.mutation<Result<SaveDatabaseAggregate>, Arg<SaveDatabaseAggregate>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseAggregate(args),
    invalidatesTags: [{ type: 'DatabaseAggregates', id: 'LIST' }],
  }),

  deleteDatabaseAggregate: b.mutation<
    Result<DeleteDatabaseAggregate>,
    Arg<DeleteDatabaseAggregate>
  >({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseAggregate(args),
    invalidatesTags: [{ type: 'DatabaseAggregates', id: 'LIST' }],
  }),

  // ---- Integrations (uses the canonical helper — one line of intent) ----
  ...buildIntegrationsEndpoints(b, {
    prefix: 'Database',
    tag: 'DatabaseIntegrations',
    namespace: (n) => n.hub.database as unknown as Record<string, (...a: never[]) => Promise<unknown>>,
    include: { test: false }, // hub.database has no testDatabaseIntegration
  }),
});
