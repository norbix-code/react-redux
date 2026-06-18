// AUTO-GENERATED — full coverage of `norbix.hub.database` (44 endpoints).
// Synced from the norbix core SDK surface. Re-run the hook sync to refresh.
import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type DisableDatabase = Norbix['hub']['database']['disableDatabase'];
type EnableDatabase = Norbix['hub']['database']['enableDatabase'];
type DeleteSchemaTrigger = Norbix['hub']['database']['deleteSchemaTrigger'];
type DisableSchemaTrigger = Norbix['hub']['database']['disableSchemaTrigger'];
type EnableSchemaTrigger = Norbix['hub']['database']['enableSchemaTrigger'];
type GetSchemaTrigger = Norbix['hub']['database']['getSchemaTrigger'];
type GetSchemaTriggers = Norbix['hub']['database']['getSchemaTriggers'];
type SaveSchemaTrigger = Norbix['hub']['database']['saveSchemaTrigger'];
type DeleteDatabaseTaxonomy = Norbix['hub']['database']['deleteDatabaseTaxonomy'];
type GetDatabaseTaxonomy = Norbix['hub']['database']['getDatabaseTaxonomy'];
type GetDatabaseTaxonomies = Norbix['hub']['database']['getDatabaseTaxonomies'];
type SaveDatabaseTaxonomy = Norbix['hub']['database']['saveDatabaseTaxonomy'];
type DeleteDatabaseTaxonomyTerm = Norbix['hub']['database']['deleteDatabaseTaxonomyTerm'];
type DeleteManyDatabaseTaxonomyTerms = Norbix['hub']['database']['deleteManyDatabaseTaxonomyTerms'];
type GetDatabaseTaxonomyTerm = Norbix['hub']['database']['getDatabaseTaxonomyTerm'];
type SaveDatabaseTaxonomyTerm = Norbix['hub']['database']['saveDatabaseTaxonomyTerm'];
type UpdateDatabaseTaxonomyTerm = Norbix['hub']['database']['updateDatabaseTaxonomyTerm'];
type DeleteDatabaseSchema = Norbix['hub']['database']['deleteDatabaseSchema'];
type DiscardDatabaseSchemaDraft = Norbix['hub']['database']['discardDatabaseSchemaDraft'];
type GetDatabaseSchema = Norbix['hub']['database']['getDatabaseSchema'];
type GetDatabaseSchemas = Norbix['hub']['database']['getDatabaseSchemas'];
type GetDatabaseSchemaDraft = Norbix['hub']['database']['getDatabaseSchemaDraft'];
type GetDatabaseSchemaVersionDiff = Norbix['hub']['database']['getDatabaseSchemaVersionDiff'];
type GetDatabaseSchemaVersions = Norbix['hub']['database']['getDatabaseSchemaVersions'];
type PublishDatabaseSchema = Norbix['hub']['database']['publishDatabaseSchema'];
type RenameDatabaseSchema = Norbix['hub']['database']['renameDatabaseSchema'];
type SaveDatabaseSchema = Norbix['hub']['database']['saveDatabaseSchema'];
type UpdateDatabaseSchemaDraft = Norbix['hub']['database']['updateDatabaseSchemaDraft'];
type UpdateDatabaseSchemaSettings = Norbix['hub']['database']['updateDatabaseSchemaSettings'];
type DeleteDatabaseIntegration = Norbix['hub']['database']['deleteDatabaseIntegration'];
type DisableDatabaseIntegration = Norbix['hub']['database']['disableDatabaseIntegration'];
type EnableDatabaseIntegration = Norbix['hub']['database']['enableDatabaseIntegration'];
type GetDatabaseIntegration = Norbix['hub']['database']['getDatabaseIntegration'];
type GetDatabaseIntegrations = Norbix['hub']['database']['getDatabaseIntegrations'];
type GetAllowedFlexTiers = Norbix['hub']['database']['getAllowedFlexTiers'];
type RevealManagedFlexConnectionString = Norbix['hub']['database']['revealManagedFlexConnectionString'];
type SaveDatabaseIntegration = Norbix['hub']['database']['saveDatabaseIntegration'];
type SetDatabaseIntegrationAsDefault = Norbix['hub']['database']['setDatabaseIntegrationAsDefault'];
type TestDatabaseIntegration = Norbix['hub']['database']['testDatabaseIntegration'];
type DeleteDatabaseAggregate = Norbix['hub']['database']['deleteDatabaseAggregate'];
type GetDatabaseAggregate = Norbix['hub']['database']['getDatabaseAggregate'];
type GetDatabaseAggregates = Norbix['hub']['database']['getDatabaseAggregates'];
type SaveDatabaseAggregate = Norbix['hub']['database']['saveDatabaseAggregate'];
type TestDatabaseAggregate = Norbix['hub']['database']['testDatabaseAggregate'];

/**
 * `hub.database` — 44 endpoints, 1:1 with the core SDK.
 */
export const hubDatabase = (b: Builder) => ({
  disableDatabase: b.mutation<Result<DisableDatabase>, Arg<DisableDatabase>>({
    query: (args) => (norbix) => norbix.hub.database.disableDatabase(args),
    invalidatesTags: ['Database'],
  }),

  enableDatabase: b.mutation<Result<EnableDatabase>, Arg<EnableDatabase>>({
    query: (args) => (norbix) => norbix.hub.database.enableDatabase(args),
    invalidatesTags: ['Database'],
  }),

  deleteSchemaTrigger: b.mutation<Result<DeleteSchemaTrigger>, Arg<DeleteSchemaTrigger>>({
    query: (args) => (norbix) => norbix.hub.database.deleteSchemaTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  disableSchemaTrigger: b.mutation<Result<DisableSchemaTrigger>, Arg<DisableSchemaTrigger>>({
    query: (args) => (norbix) => norbix.hub.database.disableSchemaTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  enableSchemaTrigger: b.mutation<Result<EnableSchemaTrigger>, Arg<EnableSchemaTrigger>>({
    query: (args) => (norbix) => norbix.hub.database.enableSchemaTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  getSchemaTrigger: b.query<Result<GetSchemaTrigger>, Arg<GetSchemaTrigger>>({
    query: (args) => (norbix) => norbix.hub.database.getSchemaTrigger(args),
    providesTags: ['Triggers'],
  }),

  getSchemaTriggers: b.query<Result<GetSchemaTriggers>, Arg<GetSchemaTriggers>>({
    query: (args) => (norbix) => norbix.hub.database.getSchemaTriggers(args),
    providesTags: ['Triggers'],
  }),

  saveSchemaTrigger: b.mutation<Result<SaveSchemaTrigger>, Arg<SaveSchemaTrigger>>({
    query: (args) => (norbix) => norbix.hub.database.saveSchemaTrigger(args),
    invalidatesTags: ['Triggers'],
  }),

  deleteDatabaseTaxonomy: b.mutation<Result<DeleteDatabaseTaxonomy>, Arg<DeleteDatabaseTaxonomy>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseTaxonomy(args),
    invalidatesTags: ['DatabaseTaxonomies'],
  }),

  getDatabaseTaxonomy: b.query<Result<GetDatabaseTaxonomy>, Arg<GetDatabaseTaxonomy>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseTaxonomy(args),
    providesTags: ['DatabaseTaxonomies'],
  }),

  getDatabaseTaxonomies: b.query<Result<GetDatabaseTaxonomies>, Arg<GetDatabaseTaxonomies>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseTaxonomies(args),
    providesTags: ['Database'],
  }),

  saveDatabaseTaxonomy: b.mutation<Result<SaveDatabaseTaxonomy>, Arg<SaveDatabaseTaxonomy>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseTaxonomy(args),
    invalidatesTags: ['DatabaseTaxonomies'],
  }),

  deleteDatabaseTaxonomyTerm: b.mutation<Result<DeleteDatabaseTaxonomyTerm>, Arg<DeleteDatabaseTaxonomyTerm>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseTaxonomyTerm(args),
    invalidatesTags: ['DatabaseTaxonomyTerms'],
  }),

  deleteManyDatabaseTaxonomyTerms: b.mutation<Result<DeleteManyDatabaseTaxonomyTerms>, Arg<DeleteManyDatabaseTaxonomyTerms>>({
    query: (args) => (norbix) => norbix.hub.database.deleteManyDatabaseTaxonomyTerms(args),
    invalidatesTags: ['DatabaseTaxonomyTerms'],
  }),

  getDatabaseTaxonomyTerm: b.query<Result<GetDatabaseTaxonomyTerm>, Arg<GetDatabaseTaxonomyTerm>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseTaxonomyTerm(args),
    providesTags: ['DatabaseTaxonomyTerms'],
  }),

  saveDatabaseTaxonomyTerm: b.mutation<Result<SaveDatabaseTaxonomyTerm>, Arg<SaveDatabaseTaxonomyTerm>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseTaxonomyTerm(args),
    invalidatesTags: ['DatabaseTaxonomyTerms'],
  }),

  updateDatabaseTaxonomyTerm: b.mutation<Result<UpdateDatabaseTaxonomyTerm>, Arg<UpdateDatabaseTaxonomyTerm>>({
    query: (args) => (norbix) => norbix.hub.database.updateDatabaseTaxonomyTerm(args),
    invalidatesTags: ['DatabaseTaxonomyTerms'],
  }),

  deleteDatabaseSchema: b.mutation<Result<DeleteDatabaseSchema>, Arg<DeleteDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseSchema(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  discardDatabaseSchemaDraft: b.mutation<Result<DiscardDatabaseSchemaDraft>, Arg<DiscardDatabaseSchemaDraft>>({
    query: (args) => (norbix) => norbix.hub.database.discardDatabaseSchemaDraft(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  getDatabaseSchema: b.query<Result<GetDatabaseSchema>, Arg<GetDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchema(args),
    providesTags: ['DatabaseSchemas'],
  }),

  getDatabaseSchemas: b.query<Result<GetDatabaseSchemas>, Arg<GetDatabaseSchemas>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchemas(args),
    providesTags: ['DatabaseSchemas'],
  }),

  getDatabaseSchemaDraft: b.query<Result<GetDatabaseSchemaDraft>, Arg<GetDatabaseSchemaDraft>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchemaDraft(args),
    providesTags: ['DatabaseSchemas'],
  }),

  getDatabaseSchemaVersionDiff: b.query<Result<GetDatabaseSchemaVersionDiff>, Arg<GetDatabaseSchemaVersionDiff>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchemaVersionDiff(args),
    providesTags: ['DatabaseSchemas'],
  }),

  getDatabaseSchemaVersions: b.query<Result<GetDatabaseSchemaVersions>, Arg<GetDatabaseSchemaVersions>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseSchemaVersions(args),
    providesTags: ['DatabaseSchemas'],
  }),

  publishDatabaseSchema: b.mutation<Result<PublishDatabaseSchema>, Arg<PublishDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.publishDatabaseSchema(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  renameDatabaseSchema: b.mutation<Result<RenameDatabaseSchema>, Arg<RenameDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.renameDatabaseSchema(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  saveDatabaseSchema: b.mutation<Result<SaveDatabaseSchema>, Arg<SaveDatabaseSchema>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseSchema(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  updateDatabaseSchemaDraft: b.mutation<Result<UpdateDatabaseSchemaDraft>, Arg<UpdateDatabaseSchemaDraft>>({
    query: (args) => (norbix) => norbix.hub.database.updateDatabaseSchemaDraft(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  updateDatabaseSchemaSettings: b.mutation<Result<UpdateDatabaseSchemaSettings>, Arg<UpdateDatabaseSchemaSettings>>({
    query: (args) => (norbix) => norbix.hub.database.updateDatabaseSchemaSettings(args),
    invalidatesTags: ['DatabaseSchemas'],
  }),

  deleteDatabaseIntegration: b.mutation<Result<DeleteDatabaseIntegration>, Arg<DeleteDatabaseIntegration>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseIntegration(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  disableDatabaseIntegration: b.mutation<Result<DisableDatabaseIntegration>, Arg<DisableDatabaseIntegration>>({
    query: (args) => (norbix) => norbix.hub.database.disableDatabaseIntegration(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  enableDatabaseIntegration: b.mutation<Result<EnableDatabaseIntegration>, Arg<EnableDatabaseIntegration>>({
    query: (args) => (norbix) => norbix.hub.database.enableDatabaseIntegration(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  getDatabaseIntegration: b.query<Result<GetDatabaseIntegration>, Arg<GetDatabaseIntegration>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseIntegration(args),
    providesTags: ['DatabaseIntegrations'],
  }),

  getDatabaseIntegrations: b.query<Result<GetDatabaseIntegrations>, Arg<GetDatabaseIntegrations>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseIntegrations(args),
    providesTags: ['DatabaseIntegrations'],
  }),

  getAllowedFlexTiers: b.query<Result<GetAllowedFlexTiers>, Arg<GetAllowedFlexTiers>>({
    query: (args) => (norbix) => norbix.hub.database.getAllowedFlexTiers(args),
    providesTags: ['DatabaseIntegrations'],
  }),

  revealManagedFlexConnectionString: b.mutation<Result<RevealManagedFlexConnectionString>, Arg<RevealManagedFlexConnectionString>>({
    query: (args) => (norbix) => norbix.hub.database.revealManagedFlexConnectionString(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  saveDatabaseIntegration: b.mutation<Result<SaveDatabaseIntegration>, Arg<SaveDatabaseIntegration>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseIntegration(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  setDatabaseIntegrationAsDefault: b.mutation<Result<SetDatabaseIntegrationAsDefault>, Arg<SetDatabaseIntegrationAsDefault>>({
    query: (args) => (norbix) => norbix.hub.database.setDatabaseIntegrationAsDefault(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  testDatabaseIntegration: b.mutation<Result<TestDatabaseIntegration>, Arg<TestDatabaseIntegration>>({
    query: (args) => (norbix) => norbix.hub.database.testDatabaseIntegration(args),
    invalidatesTags: ['DatabaseIntegrations'],
  }),

  deleteDatabaseAggregate: b.mutation<Result<DeleteDatabaseAggregate>, Arg<DeleteDatabaseAggregate>>({
    query: (args) => (norbix) => norbix.hub.database.deleteDatabaseAggregate(args),
    invalidatesTags: ['DatabaseAggregates'],
  }),

  getDatabaseAggregate: b.query<Result<GetDatabaseAggregate>, Arg<GetDatabaseAggregate>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseAggregate(args),
    providesTags: ['DatabaseAggregates'],
  }),

  getDatabaseAggregates: b.query<Result<GetDatabaseAggregates>, Arg<GetDatabaseAggregates>>({
    query: (args) => (norbix) => norbix.hub.database.getDatabaseAggregates(args),
    providesTags: ['DatabaseAggregates'],
  }),

  saveDatabaseAggregate: b.mutation<Result<SaveDatabaseAggregate>, Arg<SaveDatabaseAggregate>>({
    query: (args) => (norbix) => norbix.hub.database.saveDatabaseAggregate(args),
    invalidatesTags: ['DatabaseAggregates'],
  }),

  testDatabaseAggregate: b.mutation<Result<TestDatabaseAggregate>, Arg<TestDatabaseAggregate>>({
    query: (args) => (norbix) => norbix.hub.database.testDatabaseAggregate(args),
    invalidatesTags: ['DatabaseAggregates'],
  }),
});
