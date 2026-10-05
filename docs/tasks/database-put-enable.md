# database-put-enable — React-Redux side of the gateway module-switch and schema-env changes

## Goal

Move `@norbix.ai/react-redux` onto `@norbix.ai/ts` 4.10.0, so the module
enable / disable hooks send `PUT` and the schema list follows the request
environment, and prove both with tests.

Not in scope: hooks for `hub.code` (the package has no code module at all), a
cache that follows `norbix.setEnvironment(...)` by itself.

## Plan

1. chore(deps): require @norbix.ai/ts 4.10.0 — done, `package.json`, `package-lock.json`
2. test(hub): the 16 module-switch hooks (8 modules) are mutations and send PUT on the wire — done, `tests/module-switch.test.ts`
3. test(database): the schema list cache is keyed by `env`; rows carry `env` — done, `tests/module-switch.test.ts`
4. docs(readme): module switch is PUT; schema list and list settings are per environment — done, `README.md`

## Changes

| file                                | what changed                                                                                                                                      | plan step # |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `package.json`, `package-lock.json` | `@norbix.ai/ts` peer `>=4.10.0`, dev `^4.10.0`                                                                                                    | 1           |
| `tests/module-switch.test.ts`       | new: every module-switch hook is a mutation, reaches its SDK method and sends PUT through a fake fetch; schema list sends `env` and rows carry it | 2, 3        |
| `README.md`                         | "Module switches send PUT" and "Schemas per environment" sections                                                                                 | 4           |

## Findings

- The hooks were already mutations before this change (`src/hooks/hub/*.ts`), so no hook changed kind and no cache tag changed. Only the wire verb moved, inside `@norbix.ai/ts`. Left as is.
- There are no hooks for `hub.code` (`enableCode` / `disableCode` and the rest of the code module). An existing gap, not part of this task. Open.
- `norbix.setEnvironment(...)` does not refetch: RTK Query keys its cache by endpoint + args, and the client environment is not part of the args. Same caveat as regions; documented in the README: pass `env`, or invalidate `DatabaseSchemas` after a switch. Open (a `getClient`-aware cache key would fix it for every hook).
- `npm run format:check` reports 21 files on `main` that are not Prettier-clean (for example `tests/integrations.test.ts`, `tests/provider.test.tsx`). Not touched here. Open.
- The schema-list paging cursor changed from Redis keys to `sch_…` ids on the gateway. A cursor an app kept across the deploy will not match; RTK does not persist cursors by default. Documented, nothing to change here.

## Rejected / moved out

- (none)

## Needs you

- (none)

## Open questions

- (none)
