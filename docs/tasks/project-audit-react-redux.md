# Project audit — React-Redux hooks (item E4)

## Goal

Every Project-module endpoint of `@norbix.ai/ts` has an RTK Query hook in this
package, a test that proves it is wired 1:1, and a line in the README.

Not in scope: the JSON-RPC developer MCP endpoint (`/account/mcp`), other
modules, a hook generator.

## Plan

1. chore(deps): raise the dev dependency `@norbix.ai/ts` from `^4.2.0` to `~4.3.0` — done, `package.json`. 4.3.0 is the first version with every Project method (checked in the 4.3.0 tarball). Not 4.4.0: see Findings #1. Peer range `>=4.3.0` unchanged, so no breaking change
2. feat(project): add the 10 missing hooks to `src/hooks/hub/account.ts` (admin URL, legal documents, expose legal, admin portal structure, admin portal service user, 5 AI service-user calls) — done, commit 301bf44. The "remaining project settings" from the ask (description, URL, logo, icon, colors, languages, default language, regions, enable/disable/delete, tokens) and `getPublicProjectLegal` already had hooks on main — they had no test and no README line, so steps 3 and 4 cover them
3. test(project): one test file that checks every Project hook (old + new, Hub + public) reaches the right SDK method with the right kind and cache tag — done, `tests/project.test.ts`, 37 tests, commit 0dc2a40
4. docs(project): README section that lists every Project hook — done, commit 9d26bca
5. checks: lint, typecheck, tests, build — done: lint clean, typecheck clean, 10 files / 161 tests pass, build ok
6. push + pull request — todo

## Changes

| file | what changed | plan step # |
| ---- | ------------ | ----------- |
| `package.json`, `package-lock.json` | dev dependency `@norbix.ai/ts` ^4.2.0 -> ~4.3.0 | 1 |
| `src/hooks/hub/account.ts` | 10 new hooks; header says 46 endpoints and why `mcp` is not wrapped | 2 |
| `tests/project.test.ts` | new: 34 hub.account Project hooks + 2 public reads + "mcp not wrapped" | 3 |
| `README.md` | 2 new tables (Project settings / public config + legal); account/project rows now show the real cache tags; Prettier pass | 4 |
| `docs/tasks/project-audit-react-redux.md` | this file | all |

## Findings

1. fix(notifications): `@norbix.ai/ts` 4.4.0 removed `getEmailCampaignMessage` / `getSmsCampaignMessage` / `getPushCampaignMessage` (TS commit cd975fa, #65), but `src/hooks/hub/notifications.ts:63,98,137,422,603,807` still calls them — typecheck fails on 4.4.0, and an app on 4.4.0 gets a runtime "is not a function" from those 3 hooks. The peer range `>=4.3.0` allows 4.4.0. Left open (notifications campaign); the dev dependency stays on 4.3.x here so this branch is green.
2. docs(readme): the Hub table showed cache tags `AccountProfile/CURRENT`, `AccountProfile/PROJECTS`, `AccountProfile/PROJECT/<id>`; the code uses `Account` / `Projects`. Fixed here (README.md, Hub surface table). `useLoginMutation` row still says `AccountProfile/CURRENT` — not checked, left open.
3. refactor(hooks): `updateProjectRegions` exists in both `hubAccount` and `hubRegions`; the regions one wins because it is spread later (`src/hooks/index.ts`, known and commented in `src/hooks/hub/regions.ts:19`). The account version is dead code. Left open.
4. docs(readme): README.md on main was not Prettier-clean (SMS table), so `npm run format:check` failed on main. Fixed here by the Prettier pass.
5. chore(hooks): `src/hooks/hub/account.ts` says "AUTO-GENERATED ... Re-run the hook sync", but there is no sync script in the repo. Edited by hand; left open.

## Rejected / moved out

- `hub.account.mcp` (`/account/mcp`, developer MCP endpoint) — no hook. It is a JSON-RPC 2.0 stream for MCP clients (GET / POST / DELETE on one route, string body); an RTK Query cache entry or mutation does not model it. Documented in the README; callers use `useNorbix()`.

## Needs you

- [ ] Review and merge the pull request (not merged by the agent).

## Open questions

None.
