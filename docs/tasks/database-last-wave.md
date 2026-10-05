# Database last wave — react-redux on @norbix.ai/ts 4.11.0

## Goal

Move `@norbix.ai/react-redux` onto `@norbix.ai/ts` 4.11.0, the core SDK release that follows the last gateway Database wave.

Not in scope: new hooks (4.11.0 adds no SDK method), the follow-up aggregate field `JoinedCollections` (not in any SDK yet).

## Plan

1. chore(deps): require @norbix.ai/ts 4.11.0 — done, `package.json`, `package-lock.json`
2. test(database): `allRecords` reaches the wire for update many / delete many — done, `tests/database.test.ts`
3. docs(readme): bulk record writes, `allRecords` and the new database errors — done, `README.md`
4. chore(hooks): regenerate hooks — dropped: no hook generator exists in this repo, and 4.11.0 has the same method list as 4.10.0 (compared the `.d.ts` method names of both npm packages), so no hook is added or removed. The hook-per-SDK-method guards (`has one hook per hub.database method …`, `reaches every api.database method …`) pass.

## Changes

| file                                | what changed                                                                                                                                                  | plan step # |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `package.json`, `package-lock.json` | `@norbix.ai/ts` peer `>=4.11.0`, dev `^4.11.0`                                                                                                                | 1           |
| `tests/database.test.ts`            | two real-SDK tests: `updateManyRecords` sends `PUT …/orders/many` with `allRecords: true`; `deleteManyRecords` sends `DELETE …/orders/many` with `allRecords` | 2           |
| `README.md`                         | "Bulk record writes (core SDK 4.11.0)" section                                                                                                                | 3           |

## Findings

- What 4.11.0 changes for this package: types only. New `allRecords?: boolean` on the update-many / delete-many requests (Hub and Api); `TaxonomyListProjection.dependencyRefs` (a `TaxonomyRef { id, name? }` list) replaces `dependencyNames`; trigger rows carry `env`; `RenameDatabaseSchemaRequest.renameUniqueName` removed. No hook or test here used the removed fields. Left as is.
- `npx prettier --check .` reports 20 files with style issues that are already on `main` (docs, examples, `tests/provider.test.tsx`). Not touched here; left open.

## Rejected / moved out

- None.

## Needs you

- Nothing.

## Open questions

- None.
