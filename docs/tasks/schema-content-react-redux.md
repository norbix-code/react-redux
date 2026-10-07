# Schema content — react-redux hooks for expanded references and files by id

## Goal

Give `@norbix.ai/react-redux` the hooks the schema-content campaign adds to the core SDK (`@norbix.ai/ts` branch `audit/schema-content`): `expandReferences` on the three end-user record reads, and the two "file by id" reads.

Not in scope: merging — this branch ships to `main` only after the gateway campaign lands and `@norbix.ai/ts` releases; the generated DTO changes (ObjectFieldDto, ArrayFieldDto, JsonFieldDto, CurrencyDefaultDto, the new field properties, the new error codes) — this package carries no DTO of its own, it reads them from the core SDK's types; the `norbix.collection()` helper (plain SDK, no hook).

## Plan

1. chore(deps): build against the core SDK branch — done. `npm pack` in `/Users/djovaisas/Projects/norbix/worktrees/norbix-js/audit/schema-content` → `norbix.ai-ts-1.2.0.tgz` (scratch folder), then `npm install --no-save <tarball>` in this worktree. `package.json` / `package-lock.json` untouched: the tarball is a local overlay, not a dependency anyone can install. See "Needs you".
2. feat(files): `useGetFileByIdQuery` (`hub.files.getFileById`, `GET /{version}/files/item/by-id`) and `useGetFileByIdApiQuery` (`api.files.getFileById`, `GET /{version}/files/{filesIntegrationId}/by-id/{id}`) — done, `src/hooks/hub/files.ts`, `src/hooks/api/files.ts`.
3. docs(database): `expandReferences` and `arrayFilters` on the existing record hooks — done, `src/hooks/api/database.ts` (hook comments; no new hook: the three find hooks already pass the whole request through, the option is a request field).
4. test(files, database): hook-shape tests, fake-transport tests and real-SDK fake-fetch wire tests — done, `tests/files.test.ts`, `tests/database.test.ts`.
5. docs(readme): "Expanded references and files by id" section — done, `README.md`.
6. ship: `nbx-ship --no-merge` — done, pull request link in "Needs you".

## Changes

| file                                       | what changed                                                                                                                                                                                        | plan step # |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `src/hooks/api/files.ts`                   | `getFileByIdApi` query (provides `Files`); header route list and count 10 → 11                                                                                                                      | 2           |
| `src/hooks/hub/files.ts`                   | `getFileById` query (provides `Files`); header route list and count 22 → 23                                                                                                                         | 2           |
| `src/hooks/api/database.ts`                | comments on `findCollection` / `findOne` / `findOwn` (`expandReferences`, error 056) and `updateOne` / `updateMany` (`arrayFilters`)                                                                | 3           |
| `tests/files.test.ts`                      | counts 23 / 11; both by-id hooks reach their SDK method and are `Files` queries; not shadowed in the flat map; real-SDK fake-fetch: route with the ids substituted, `isPublic` / `publicUrl` parsed | 4           |
| `tests/database.test.ts`                   | real-SDK fake-fetch: `expandReferences=true` reaches the wire on `findCollection`, `findOne`, `findOwn` (Api), `arrayFilters` on `updateOne`; a 056 refusal lands as the serialized error           | 4           |
| `README.md`                                | section "Expanded references and files by id (core SDK, schema-content)"                                                                                                                            | 5           |
| `docs/tasks/schema-content-react-redux.md` | this file                                                                                                                                                                                           | —           |

## Findings

- The hub `getFileById` request DTO (`CodeMashHub2.GetFileById`) carries `filesIntegrationId` and `id` as plain `@ApiMember`s with no path params, so the core SDK sends them as query string on `GET /v2/files/item/by-id`; the Api one substitutes both into the path. The wire tests pin both. Nothing to fix here.
- `apiDatabase` hooks still pass `(arg as { collectionName?: string })` for the tag id — the arg type already has `collectionName`, the cast is a leftover from before the typed `Arg<>` helper. Left as is (not this task).
- `npx prettier --check .` reports the same 20 pre-existing files as the last task (docs, examples, `tests/provider.test.tsx`). Not touched.

## Rejected / moved out

- Bumping `@norbix.ai/ts` in `package.json` to the version carrying these methods — impossible now: that version is not published (the core SDK branch is also waiting for the gateway campaign). The bump is the first commit on this branch once `@norbix.ai/ts` releases; until then the pull request checks run against npm's 4.11.0 and the typecheck / tests are red there by design (see "Needs you").
- A per-id cache tag for the by-id reads (like `getPublicFile`'s `Files/PUBLIC:<id>`) — not done: `isPublic` / `publicUrl` are part of the by-id answer, and publish / unpublish / delete invalidate the plain `Files` tag, so the whole-tag refetch is the correct one; a private id tag would make those answers stale.

## Needs you

- The pull request is opened with `--no-merge`. Its checks are red on purpose until `@norbix.ai/ts` publishes the schema-content release: then (1) `npm install --save-dev @norbix.ai/ts@<that version>` and bump the peer range in `package.json` on this branch, (2) re-run `npm test`, `npm run typecheck`, `npm run lint`, (3) merge with "Rebase and merge".
- Nothing else.

## Open questions

- None.
