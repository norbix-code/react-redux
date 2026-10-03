# Project audit — React-Redux hooks (item E4)

## Goal

Every Project-module endpoint of `@norbix.ai/ts` has an RTK Query hook in this
package, a test that proves it is wired 1:1, and a line in the README.

Not in scope: the JSON-RPC developer MCP endpoint (`/account/mcp`), other
modules, a hook generator.

## Plan

1. chore(deps): raise the dev dependency `@norbix.ai/ts` from `^4.2.0` to `~4.3.0` — done, `package.json`. 4.3.0 is the first version with every Project method (checked in the 4.3.0 tarball). Not 4.4.0: see Findings #1. Peer range `>=4.3.0` unchanged, so no breaking change
2. feat(project): add the 10 missing hooks to `src/hooks/hub/account.ts` (admin URL, legal documents, expose legal, admin portal structure, admin portal service user, 5 AI service-user calls) — todo
3. test(project): one test file that checks every Project hook (old + new, Hub + public) reaches the right SDK method with the right kind and cache tag — todo
4. docs(project): README section that lists every Project hook — todo
5. checks: lint, typecheck, tests, build — todo
6. push + pull request — todo

## Changes

| file | what changed | plan step # |
| ---- | ------------ | ----------- |

## Findings

1. fix(notifications): `@norbix.ai/ts` 4.4.0 removed `getEmailCampaignMessage` / `getSmsCampaignMessage` / `getPushCampaignMessage` (TS commit cd975fa, #65), but `src/hooks/hub/notifications.ts:63,98,137,422,603,807` still calls them — typecheck fails on 4.4.0, and an app on 4.4.0 gets a runtime "is not a function" from those 3 hooks. The peer range `>=4.3.0` allows 4.4.0. Left open (notifications campaign); the dev dependency stays on 4.3.x here so this branch is green.

## Rejected / moved out

## Needs you

## Open questions

None.
