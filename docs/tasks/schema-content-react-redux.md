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
7. build(deps): `@norbix.ai/ts` `^4.14.0` (dev) / `>=4.14.0` (peer) — done, `package.json`, `package-lock.json` (sdk-ts #79 released as v4.14.0 on 2026-10-07; lockfile also moves `source-map-js` 1.2.1 → 1.2.2 and the bundled `npm` 11.19.1 → 11.21.0 for the OSV scan).
8. merge: "Rebase and merge" once the Security scan is green — todo, see "Needs you".

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
- This repo's commitlint (`husky` commit-msg hook, `@commitlint/config-conventional`) refuses a `[N]` step prefix on the subject, so the commits here are plain conventional subjects with `Step N of docs/tasks/…` in the body. Same as every earlier task in this repo.
- `npx prettier --check .` reports the same 20 pre-existing files as the last task (docs, examples, `tests/provider.test.tsx`). Not touched.

## Rejected / moved out

- Bumping `@norbix.ai/ts` in `package.json` to the version carrying these methods — impossible now: that version is not published (the core SDK branch is also waiting for the gateway campaign). The bump is the first commit on this branch once `@norbix.ai/ts` releases; until then the pull request checks run against npm's 4.11.0 and the typecheck / tests are red there by design (see "Needs you").
- A per-id cache tag for the by-id reads (like `getPublicFile`'s `Files/PUBLIC:<id>`) — not done: `isPublic` / `publicUrl` are part of the by-id answer, and publish / unpublish / delete invalidate the plain `Files` tag, so the whole-tag refetch is the correct one; a private id tag would make those answers stale.

## Needs you

- Pull request https://github.com/norbix-code/react-redux/pull/43: the `@norbix.ai/ts` bump to 4.14.0 is on the branch (plan step 7; lint, typecheck, 269 tests, build green locally). One check stays red and it is not the SDK: **Security scan → OSV** flags `postcss-selector-parser` 7.1.4 (GHSA-rj75-hqrm-r3gf, dev-only, bundled inside the `npm` CLI that `@semantic-release/npm` runs). No update fixes it — npm 11.21.0, the newest in the range semantic-release accepts, still bundles 7.1.4, and overrides cannot change bundled packages. The fix is a dated `[[IgnoredVulns]]` entry in `osv-scanner.toml` like the three `brace-expansion` ones (pull request 34). The agent did not add it (an ignore entry is your call). Add it (`id = "GHSA-rj75-hqrm-r3gf"`, `ignoreUntil = 2026-11-07`, dev-only reason), push, then `nbx-ship --wait-release --cleanup` from this worktree.

## Open questions

- None.
