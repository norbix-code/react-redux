# Contributing to `@norbix/react-redux`

This package wraps the [`norbix`](https://github.com/norbix-code/sdk-ts) TypeScript SDK in RTK Query helpers for React + Redux Toolkit apps. Releases are cut by CI on every push to `main`. The flow below mirrors what CI runs — keep your local steps aligned with CI and you'll never get a surprise on merge.

## Local setup

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Node 18 or newer is required. The package itself ships zero runtime dependencies — `react`, `react-redux`, `@reduxjs/toolkit`, and `norbix` are peer dependencies, so consumers control their own versions.

## Editing the package

The hand-written surface is small:

| Area | What lives here |
|---|---|
| `src/baseQuery.ts` | The custom RTK Query base query that wraps the Norbix SDK. |
| `src/createNorbixApi.ts` | Factory that builds the RTK Query API slice with the canonical tag taxonomy. |
| `src/provider.tsx` | `<NorbixProvider>` + `useNorbix` hook. |
| `src/errors.ts` | `SerializedNorbixError` shape + serializer. |
| `src/helpers/integrations.ts` | One-line `*Integrations` CRUD generator. |
| `src/hooks/api/*` | Curated hooks for `norbix.api.*` modules. |
| `src/hooks/hub/*` | Curated hooks for `norbix.hub.*` modules. |
| `tests/*` | Vitest specs covering the above. |
| `examples/basic/` | Self-contained Vite + React + RTK demo app. |

Need a hook the package doesn't ship? Either add it under `src/hooks/{api,hub}/<module>.ts` and send a PR, or extend in your own app via `injectEndpoints` (see the README's "Add your own endpoints" section).

## Conventional commits

Every commit message must follow [Conventional Commits](https://www.conventionalcommits.org/). `commitlint` runs as a Husky `commit-msg` hook and rejects messages that don't conform.

The commit type maps to the version bump:

| Type | Version bump | Example |
| --- | --- | --- |
| `feat:` | minor | `feat(hooks): add useGetEmailIntegrationsQuery` |
| `fix:` | patch | `fix(baseQuery): preserve fieldErrors on 422` |
| `perf:` | patch | `perf(integrations): skip unused method lookup` |
| `refactor:` | patch | `refactor(provider): drop redundant useMemo` |
| `docs(readme):` | patch | `docs(readme): clarify provider order with Redux` |
| `chore:` `test:` `ci:` `style:` | none | maintenance, no release |
| any with `!` or `BREAKING CHANGE:` footer | major | `feat!: drop React 17 support` |

You can preview what a PR would release. PRs to `main` get a sticky comment from the `release-preview` workflow showing the computed next version before you merge.

## CI overview

Every PR runs four parallel pipelines. All must pass.

### `ci.yml` → job `build`

1. `npm ci`
2. `npm run lint` — ESLint (flat config, TypeScript strict, react-hooks rules).
3. `npm run typecheck` — `tsc --noEmit`. Test files included.
4. `npm test` — Vitest with happy-dom for the React tests.
5. `npm run build` — tsup dual ESM/CJS build into `dist/`.
6. **Pack guard** — `npm pack --dry-run` to confirm only release files ship. Fails if the tarball exceeds 500 KB or contains forbidden paths (`src/`, `tests/`, `examples/`, etc.).

### `ci.yml` → job `security`

1. **`npm audit --omit=dev --audit-level=high`** — fails the build on any HIGH or CRITICAL CVE in production deps. Dev deps are excluded because they don't ship to consumers.
2. **`npm audit signatures`** — verifies every installed package was published with a valid registry signature. Catches typosquats and registry compromises.
3. **Trivy** — scans config (workflow + Dockerfiles + YAML), committed secrets, and language-level deps. SARIF uploaded to the Security tab.
4. **OSV scanner** — Google's vulnerability database. Wider coverage than `npm audit`.

### `codeql.yml`

GitHub's native SAST for JavaScript / TypeScript. Runs the `security-extended` query suite on PR + push + weekly cron.

### `security-nightly.yml`

Re-runs `npm audit`, signatures check, Trivy, and OSV scanner against `main` every night at 04:00 UTC. Catches CVEs published against deps you already use, even when no code changes. The nightly job is informational — it does not fail `main`.

### Dependabot

Opens PRs for npm + GitHub Actions updates weekly (Monday 06:00 Europe/Vilnius). Minor + patch updates are grouped to cut review load. The React stack (`react`, `react-redux`, `@reduxjs/toolkit`, `@types/react*`) is grouped together so a React minor bumps everything in one PR.

## Releases

`release.yml` runs on every push to `main`, `next`, or `beta`.

1. `npm ci` and full CI suite (lint, typecheck, test, build, pack guard, audit).
2. `npx semantic-release`:
   - Reads conventional commits since the last tag.
   - Computes the next version (or skips if no release-worthy commits).
   - Updates `package.json` + `CHANGELOG.md`.
   - Tags the release.
   - Publishes to npm with **provenance** (`NPM_CONFIG_PROVENANCE=true`).
   - Creates a GitHub Release with the changelog.
   - Pushes the version-bump commit back to the branch.

`next` and `beta` branches publish prereleases (`1.2.0-beta.3`, etc.) and never promote to `latest` on npm.

### Required secrets

| Secret | Where to set it | What it's for |
| --- | --- | --- |
| `NPM_TOKEN` | GitHub repo settings → Secrets → Actions | npm Automation token, granular publish scope on `@norbix/react-redux`. Must be **Automation** type so npm accepts it without 2FA prompts. |
| `GITHUB_TOKEN` | provided by Actions | Used for git push, tag, and GH Release. No setup needed. |

### How to debug a failed release

- **`semantic-release` says "no release-worthy commits"** — your commits don't bump anything. Use `feat:` / `fix:` / `feat!:` for the bump you want. Squash merging? Make sure the squash subject also follows conventional commits.
- **`npm publish` 401** — `NPM_TOKEN` expired or doesn't have publish scope on `@norbix/react-redux`. Regenerate as Automation token.
- **`audit` failure mid-release** — a CVE landed between the PR's CI run and the merge. Land a fix or wait for the patched version (Dependabot usually opens a PR within minutes).

## Repository layout

```
.github/workflows/         CI, release, release-preview, codeql, security-nightly
.github/dependabot.yml     weekly npm + actions update PRs
.husky/                    git hooks (commit-msg → commitlint, pre-commit → lint)
examples/basic/            Vite + React + RTK demo app
src/
  provider.tsx             <NorbixProvider> + useNorbix
  baseQuery.ts             custom RTK Query base query wrapping the SDK
  createNorbixApi.ts       factory + tag taxonomy
  errors.ts                SerializedNorbixError
  helpers/integrations.ts  buildIntegrationsEndpoints helper
  hooks/
    api/                   curated hooks for norbix.api.*
    hub/                   curated hooks for norbix.hub.*
tests/                     Vitest specs
package.json
tsconfig.json
tsup.config.ts             dual ESM/CJS build config
vitest.config.ts           happy-dom for React tests
.releaserc.json            semantic-release plugins + branches
.commitlintrc.json
eslint.config.js           flat ESLint config + react-hooks
```

## Questions

Open a [GitHub Discussion](https://github.com/norbix-code/react-redux/discussions) or an issue. PRs welcome.
