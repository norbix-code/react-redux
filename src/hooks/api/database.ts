import type { Norbix } from 'norbix';

import type { Builder } from '../index.js';
import type { Arg, Result } from '../types.js';

type Find = Norbix['api']['database']['find'];
type FindOne = Norbix['api']['database']['findOne'];
type Count = Norbix['api']['database']['count'];
type Distinct = Norbix['api']['database']['distinct'];
type Aggregate = Norbix['api']['database']['aggregate'];
type ExecuteAggregate = Norbix['api']['database']['executeAggregate'];
type InsertOne = Norbix['api']['database']['insertOne'];
type InsertMany = Norbix['api']['database']['insertMany'];
type UpdateOne = Norbix['api']['database']['updateOne'];
type UpdateMany = Norbix['api']['database']['updateMany'];
type ReplaceOne = Norbix['api']['database']['replaceOne'];
type DeleteOne = Norbix['api']['database']['deleteOne'];
type DeleteMany = Norbix['api']['database']['deleteMany'];
type ChangeResponsibility = Norbix['api']['database']['changeResponsibility'];
type FindTerms = Norbix['api']['database']['findTerms'];
type FindTermsChildren = Norbix['api']['database']['findTermsChildren'];
type FindTermTree = Norbix['api']['database']['findTermTree'];
type FindTaxonomyTree = Norbix['api']['database']['findTaxonomyTree'];
type GetDatabaseSchema = Norbix['api']['database']['getDatabaseSchema'];
type GetDatabaseSchemas = Norbix['api']['database']['getDatabaseSchemas'];

/**
 * `api.database` — runtime collection CRUD + taxonomies + read-only schemas.
 *
 * Tag conventions:
 *   - `DatabaseCollections/<collectionName>`  — per-collection cache key.
 *     Every write to a collection invalidates only that collection's reads.
 *   - `DatabaseTaxonomyTerms/<taxonomyName>`  — per-taxonomy term lists.
 *   - `DatabaseSchemas/<id>`                  — per-schema reads (mostly Hub-driven).
 */
export const apiDatabase = (b: Builder) => ({
  // ---- Collections — Read ----
  findCollection: b.query<Result<Find>, Arg<Find>>({
    query: (args) => (norbix) => norbix.api.database.find(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  findOne: b.query<Result<FindOne>, Arg<FindOne>>({
    query: (args) => (norbix) => norbix.api.database.findOne(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  countCollection: b.query<Result<Count>, Arg<Count>>({
    query: (args) => (norbix) => norbix.api.database.count(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  distinct: b.query<Result<Distinct>, Arg<Distinct>>({
    query: (args) => (norbix) => norbix.api.database.distinct(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  aggregate: b.mutation<Result<Aggregate>, Arg<Aggregate>>({
    query: (args) => (norbix) => norbix.api.database.aggregate(args),
  }),

  executeAggregate: b.mutation<Result<ExecuteAggregate>, Arg<ExecuteAggregate>>({
    query: (args) => (norbix) => norbix.api.database.executeAggregate(args),
  }),

  // ---- Collections — Write ----
  insertOne: b.mutation<Result<InsertOne>, Arg<InsertOne>>({
    query: (args) => (norbix) => norbix.api.database.insertOne(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  insertMany: b.mutation<Result<InsertMany>, Arg<InsertMany>>({
    query: (args) => (norbix) => norbix.api.database.insertMany(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  updateOne: b.mutation<Result<UpdateOne>, Arg<UpdateOne>>({
    query: (args) => (norbix) => norbix.api.database.updateOne(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  updateMany: b.mutation<Result<UpdateMany>, Arg<UpdateMany>>({
    query: (args) => (norbix) => norbix.api.database.updateMany(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  replaceOne: b.mutation<Result<ReplaceOne>, Arg<ReplaceOne>>({
    query: (args) => (norbix) => norbix.api.database.replaceOne(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  deleteOne: b.mutation<Result<DeleteOne>, Arg<DeleteOne>>({
    query: (args) => (norbix) => norbix.api.database.deleteOne(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  deleteMany: b.mutation<Result<DeleteMany>, Arg<DeleteMany>>({
    query: (args) => (norbix) => norbix.api.database.deleteMany(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  changeResponsibility: b.mutation<Result<ChangeResponsibility>, Arg<ChangeResponsibility>>({
    query: (args) => (norbix) => norbix.api.database.changeResponsibility(args),
    invalidatesTags: (_res, _err, arg) => [
      { type: 'DatabaseCollections', id: (arg as { collectionName?: string })?.collectionName ?? 'ANY' },
    ],
  }),

  // ---- Taxonomies (read-only on api; admin lives in hub.database) ----
  findTerms: b.query<Result<FindTerms>, Arg<FindTerms>>({
    query: (args) => (norbix) => norbix.api.database.findTerms(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseTaxonomyTerms', id: (arg as { taxonomyName?: string })?.taxonomyName ?? 'ANY' },
    ],
  }),

  findTermsChildren: b.query<Result<FindTermsChildren>, Arg<FindTermsChildren>>({
    query: (args) => (norbix) => norbix.api.database.findTermsChildren(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseTaxonomyTerms', id: (arg as { taxonomyName?: string })?.taxonomyName ?? 'ANY' },
    ],
  }),

  // Whole term tree of a taxonomy (or a sub-tree from a root term) in one call.
  findTermTree: b.query<Result<FindTermTree>, Arg<FindTermTree>>({
    query: (args) => (norbix) => norbix.api.database.findTermTree(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseTaxonomyTerms', id: (arg as { taxonomyName?: string })?.taxonomyName ?? 'ANY' },
    ],
  }),

  // Single-parent taxonomy structure tree (Countries → Cities), optionally with terms.
  findTaxonomyTree: b.query<Result<FindTaxonomyTree>, Arg<FindTaxonomyTree>>({
    query: (args) => (norbix) => norbix.api.database.findTaxonomyTree(args),
    providesTags: () => [{ type: 'DatabaseTaxonomyTerms', id: 'ANY' }],
  }),

  // ---- Schemas (read-only mirror; full CRUD lives in hub.database) ----
  getApiDatabaseSchema: b.query<Result<GetDatabaseSchema>, Arg<GetDatabaseSchema>>({
    query: (args) => (norbix) => norbix.api.database.getDatabaseSchema(args),
    providesTags: (_res, _err, arg) => [
      { type: 'DatabaseSchemas', id: (arg as { id?: string })?.id ?? 'CURRENT' },
    ],
  }),

  getApiDatabaseSchemas: b.query<Result<GetDatabaseSchemas>, Arg<GetDatabaseSchemas>>({
    query: (args) => (norbix) => norbix.api.database.getDatabaseSchemas(args),
    providesTags: [{ type: 'DatabaseSchemas', id: 'LIST' }],
  }),
});
