# Project exposure switches — React-Redux hooks (item B3a, part 2)

## Goal

Add `updateProjectExposeBrand` / `updateProjectExposeAuth` mutation hooks
(invalidate `Projects`), mirroring `updateProjectExposeLegal`, with tests in
`tests/project.test.ts` and README rows.

Not in scope: the TypeScript SDK methods themselves (done in `sdk-ts` branch
`audit/project`, file `docs/tasks/project-exposure-ts.md` there), any other hook.

## Plan

1. docs(tasks): this item file — done
2. chore(deps): raise the dev dependency `@norbix.ai/ts` to the first release that
   has `hub.account.updateProjectExposeBrand` / `updateProjectExposeAuth` — todo,
   blocked: not published yet (npm has 4.4.0 at most; the methods are only on
   `sdk-ts` branch `audit/project`, no pull request yet)
3. feat(project): in `src/hooks/hub/account.ts` add
   `type UpdateProjectExposeBrand = Norbix['hub']['account']['updateProjectExposeBrand'];`
   and the `Auth` twin next to `UpdateProjectExposeLegal` (line 53), and two
   `b.mutation<Result<…>, Arg<…>>` entries after `updateProjectExposeLegal`
   (line 339) with `invalidatesTags: ['Projects']`; bump the header endpoint count
   — todo, after step 2
4. test(project): add `'updateProjectExposeBrand'`, `'updateProjectExposeAuth'` to
   the mutation list in `tests/project.test.ts` (after `'updateProjectExposeLegal'`,
   line 71) — todo, after step 2
5. docs(project): two README rows after `useUpdateProjectExposeLegalMutation`
   (README.md line 252): `useUpdateProjectExposeBrandMutation` /
   `useUpdateProjectExposeAuthMutation`, `invalidates Projects` — todo, after step 2
6. checks (lint, typecheck, tests, build), push to pull request #33, PR comment —
   todo, after step 2

## Changes

| file | what changed | plan step # |
| ---- | ------------ | ----------- |
| `docs/tasks/project-exposure-react-redux.md` | this file | 1 |

## Findings

- The hook types are read from the SDK (`Norbix['hub']['account'][name]`), so a
  hook for a method that is not in the installed `@norbix.ai/ts` fails `tsc`.
  The repo has no stub / cast path for unreleased methods; its history (e.g.
  1204fac "build against @norbix.ai/ts 4.4.0") always waits for the release and
  then raises the dev dependency. Followed that here — open until the TS release.
- Raising the dev dependency to 4.5.x will also pull in the 4.4.0 removal of the
  three campaign-message methods (Finding #1 in
  `docs/tasks/project-audit-react-redux.md`); main already handles that in
  1204fac, so rebase this branch on main before step 2 — open.

## Rejected / moved out

- Writing the hooks now against `~4.3.0`: rejected, `tsc` fails (method missing
  on the type), which would break pull request #33's green build.
- Linking the local unreleased TS build (`file:` / `npm link`) in `package.json`:
  rejected, it would ship a dev-only path in the lockfile.

## Needs you

- [ ] Get the TS pull request opened and merged (`sdk-ts` `audit/project`), so CI
      releases the next `@norbix.ai/ts` minor with the two methods.
- [ ] Then run steps 2–6 here (or ask an agent to).

## Open questions

None.
