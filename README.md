<!-- BEGIN: HERO -->
<p align="center">
  <a href="https://norbix.ai">
    <img src="https://norbix.ai/brand/wordmark.svg" alt="Norbix" height="64" />
  </a>
</p>

<div align="center">
  <h1>Norbix React + Redux Toolkit</h1>
  <p><strong>RTK Query helpers over the typed Norbix SDK — cache, dedup, refetch, invalidation.</strong></p>

  <p>
    <a href="https://github.com/norbix-code/react-redux/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
    <a href="https://github.com/norbix-code/react-redux/actions"><img alt="CI" src="https://github.com/norbix-code/react-redux/actions/workflows/ci.yml/badge.svg" /></a>
    <a href="https://www.npmjs.com/package/@norbix/react-redux"><img alt="@norbix/react-redux" src="https://img.shields.io/npm/v/@norbix/react-redux.svg?label=@norbix/react-redux&logo=npm" /></a>
  </p>

  <hr />
</div>
<!-- END: HERO -->

## What this is

`@norbix/react-redux` is a thin, opinionated layer that wires the Norbix TypeScript SDK into a Redux Toolkit + RTK Query app. You get React hooks for the most-used Norbix endpoints with full caching, request dedup, and tag-based invalidation built in. Under the hood every hook calls the same typed `Norbix` SDK — so DTOs, auth, errors, and base URLs all stay consistent with the rest of your stack.

| You get | Provided by |
|---|---|
| `useGetUsersQuery`, `useFindCollectionQuery`, `useInsertOneMutation`, ... | this package |
| Cache, dedup, polling, refetch on focus, optimistic updates | RTK Query (`@reduxjs/toolkit/query`) |
| Tree-shakeable typed methods, JWT auth, error mapping | `norbix` SDK |

## Install

```sh
npm install @norbix/react-redux norbix @reduxjs/toolkit react-redux react
```

## Quickstart

Three steps: create the API slice, plug it into your store, mount the provider.

```ts
// src/norbix.ts
import { Norbix } from 'norbix';
import { createNorbixApi } from '@norbix/react-redux';

export const norbix = new Norbix(); // reads env vars, or pass { apiKey, projectId }

export const norbixApi = createNorbixApi(() => norbix);

export const {
  useGetUsersQuery,
  useInviteUserMutation,
  useFindCollectionQuery,
  useInsertOneMutation,
  useUpdateOneMutation,
  useDeleteOneMutation,
  useGetAccountProfileQuery,
  useGetDatabaseSchemasQuery,
  useLoginMutation,
} = norbixApi;
```

```ts
// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { norbixApi } from './norbix';

export const store = configureStore({
  reducer: { [norbixApi.reducerPath]: norbixApi.reducer },
  middleware: (getDefault) => getDefault().concat(norbixApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```tsx
// src/main.tsx
import { Provider } from 'react-redux';
import { NorbixProvider } from '@norbix/react-redux';
import { store } from './store';
import { norbix } from './norbix';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <NorbixProvider client={norbix}>
      <App />
    </NorbixProvider>
  </Provider>,
);
```

```tsx
// src/UsersList.tsx
import { useGetUsersQuery, useInviteUserMutation } from './norbix';

export function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery({ take: 20, skip: 0 });
  const [invite, { isLoading: inviting }] = useInviteUserMutation();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.users?.map((u) => <li key={u.id}>{u.email}</li>)}
      <button
        disabled={inviting}
        onClick={() => invite({ email: 'maya@team.io', roleIds: [] })}
      >
        Invite
      </button>
    </ul>
  );
}
```

After `invite()` resolves, the `User/LIST` tag is invalidated and `useGetUsersQuery` automatically refetches — no manual cache busting needed.

## What ships in the box

A *curated* set of hooks for the most common endpoints. Every hook is end-to-end typed from the SDK's own DTOs.

### API surface — `norbix.api.*`

| Hook | Wraps | Cache tags |
|---|---|---|
| `useLoginMutation` | `client.login(...)` | invalidates `User/LIST`, `AccountProfile/CURRENT` |
| `useLogoutMutation` | `client.logout()` | invalidates `User`, `AccountProfile`, `Collection`, `Schema` |
| `useAuthenticateMutation` | `api.auth.authenticate` | — |
| `useGetUsersQuery` | `api.membership.getUsers` | provides `User/LIST` |
| `useGetUserQuery` | `api.membership.getUser` | provides `User/<id>` |
| `useInviteUserMutation` | `api.membership.inviteUser` | invalidates `User/LIST` |
| `useUpdateUserMutation` | `api.membership.updateUser` | invalidates `User/<id>` + `User/LIST` |
| `useBlockUserMutation` | `api.membership.blockUser` | invalidates `User/LIST` |
| `useUnblockUserMutation` | `api.membership.unblockUser` | invalidates `User/LIST` |
| `useDeleteUserMutation` | `api.membership.deleteUser` | invalidates `User/LIST` |
| `useFindCollectionQuery` | `api.database.find` | provides `Collection/<name>` |
| `useFindOneQuery` | `api.database.findOne` | provides `Collection/<name>` |
| `useCountCollectionQuery` | `api.database.count` | provides `Collection/<name>` |
| `useInsertOneMutation` | `api.database.insertOne` | invalidates `Collection/<name>` |
| `useUpdateOneMutation` | `api.database.updateOne` | invalidates `Collection/<name>` |
| `useReplaceOneMutation` | `api.database.replaceOne` | invalidates `Collection/<name>` |
| `useDeleteOneMutation` | `api.database.deleteOne` | invalidates `Collection/<name>` |
| `useFindTermsQuery` | `api.database.findTerms` | provides `DatabaseTaxonomyTerms/<taxonomyName>` |
| `useFindTermsChildrenQuery` | `api.database.findTermsChildren` | provides `DatabaseTaxonomyTerms/<taxonomyName>` |
| `useFindTermTreeQuery` | `api.database.findTermTree` | provides `DatabaseTaxonomyTerms/<taxonomyName>` |
| `useFindTaxonomyTreeQuery` | `api.database.findTaxonomyTree` | provides `DatabaseTaxonomyTerms/ANY` |
| `useGetApiKeysQuery` | `api.apikeys.getApiKeys` | provides `ApiKey/LIST` |
| `useRegenerateApiKeysMutation` | `api.apikeys.regenerateApiKeys` | invalidates `ApiKey/LIST` |

### Hub surface — `norbix.hub.*`

| Hook | Wraps | Cache tags |
|---|---|---|
| `useGetAccountProfileQuery` | `hub.account.getAccountProfile` | provides `AccountProfile/CURRENT` |
| `useGetAccountStatusQuery` | `hub.account.getAccountStatus` | provides `AccountProfile/STATUS` |
| `useUpdateAccountProfileMutation` | `hub.account.updateAccountProfile` | invalidates `AccountProfile/CURRENT` |
| `useGetProjectsQuery` | `hub.account.getProjects` | provides `AccountProfile/PROJECTS` |
| `useGetProjectQuery` | `hub.account.getProject` | provides `AccountProfile/PROJECT/<id>` |
| `useCreateProjectMutation` | `hub.account.createProject` | invalidates `AccountProfile/PROJECTS` |
| `useDeleteProjectMutation` | `hub.account.deleteProject` | invalidates `AccountProfile/PROJECTS` |
| `useListRegionsQuery` | `hub.regions.list` | provides `Regions` |
| `useUpdateProjectRegionsMutation` | `hub.regions.updateProjectRegions` | invalidates `Regions` + `Projects` |
| `useGetDatabaseSchemasQuery` | `hub.database.getDatabaseSchemas` | provides `Schema/LIST` |
| `useGetDatabaseSchemaQuery` | `hub.database.getDatabaseSchema` | provides `Schema/<id>` |
| `useSaveDatabaseSchemaMutation` | `hub.database.saveDatabaseSchema` | invalidates `Schema/LIST` |
| `useRenameDatabaseSchemaMutation` | `hub.database.renameDatabaseSchema` | invalidates `Schema/LIST` + `Schema/<id>` |
| `usePublishDatabaseSchemaMutation` | `hub.database.publishDatabaseSchema` | invalidates `Schema` + `Collection` |
| `useDeleteDatabaseSchemaMutation` | `hub.database.deleteDatabaseSchema` | invalidates `Schema/LIST` + `Collection` |
| `useGetEmailTemplatesQuery` | `hub.notifications.getEmailTemplates` | provides `Notification/EMAIL_TEMPLATE_LIST` |
| `useGetEmailTemplateQuery` | `hub.notifications.getEmailTemplate` | provides `Notification/EMAIL_TEMPLATE/<id>` |
| `useCreateEmailTemplateMutation` | `hub.notifications.createEmailTemplate` | invalidates `Notification/EMAIL_TEMPLATE_LIST` |
| `useUpdateEmailTemplateMutation` | `hub.notifications.updateEmailTemplate` | invalidates list + per-id |
| `useDeleteEmailTemplateMutation` | `hub.notifications.deleteEmailTemplate` | invalidates list |

> **Need a hook we don't ship?** Two options. (1) Drop down to the SDK with `useNorbix()` for a one-off call. (2) Add a new file under `src/hooks/api/` or `src/hooks/hub/`, follow the pattern of the others, and open a PR.

## Working with terms

A **taxonomy** is a named tree of **terms** (labels). A term can have one parent (a clean hierarchy) or several parents (the same item under many categories). There is one read hook per scenario — pick the one that matches what you want:

| I want to… | Hook | `data` holds |
| --- | --- | --- |
| Get a taxonomy's terms as a flat list | `useFindTermsQuery` | a paginated `list` of terms |
| Get only the children of one term | `useFindTermsChildrenQuery` | a `list` of child terms (direct + multi-parent) |
| Get a taxonomy's terms as a ready-made tree | `useFindTermTreeQuery` | a `tree` of nested term nodes |
| Get the taxonomy structure (e.g. Countries → Cities) | `useFindTaxonomyTreeQuery` | a `tree` of taxonomy nodes |

All four share the same cache tag, so a write to a taxonomy refreshes every term view automatically. The examples below all use one example `services` taxonomy shaped like this:

```text
Indoors
  └─ Air conditioning
       └─ Wall-mounted
Outdoors
  └─ Solar panels
```

---

### List a taxonomy's terms (flat)

**Goal:** show every term of `services` in a simple list, in display order.

```tsx
const { data, isLoading } = useFindTermsQuery({ taxonomyName: 'services' });
```

```json
{
  "list": {
    "items": [
      { "id": "term_indoors",   "taxonomyName": "services", "parentId": null,           "order": 1, "name": "Indoors" },
      { "id": "term_air_con",   "taxonomyName": "services", "parentId": "term_indoors", "order": 1, "name": "Air conditioning" },
      { "id": "term_wall",      "taxonomyName": "services", "parentId": "term_air_con", "order": 1, "name": "Wall-mounted" },
      { "id": "term_outdoors",  "taxonomyName": "services", "parentId": null,           "order": 2, "name": "Outdoors" },
      { "id": "term_solar",     "taxonomyName": "services", "parentId": "term_outdoors","order": 1, "name": "Solar panels" }
    ],
    "hasMore": false, "hasPrevious": false, "startingAfter": null, "endingBefore": null
  },
  "responseStatus": { "isSuccess": true }
}
```

The list is flat — every term is one row, with its `parentId` telling you where it sits. The nesting is not built for you here (use `useFindTermTreeQuery` for that).

---

### List only top-level terms (filtered)

**Goal:** show just the roots (no parent) — for the first level of a menu.

```tsx
const { data } = useFindTermsQuery({
  taxonomyName: 'services',
  filter: '{ "parentId": null }',
});
```

```json
{
  "list": {
    "items": [
      { "id": "term_indoors",  "taxonomyName": "services", "parentId": null, "order": 1, "name": "Indoors" },
      { "id": "term_outdoors", "taxonomyName": "services", "parentId": null, "order": 2, "name": "Outdoors" }
    ],
    "hasMore": false, "hasPrevious": false, "startingAfter": null, "endingBefore": null
  },
  "responseStatus": { "isSuccess": true }
}
```

`filter` is an optional MongoDB filter, ANDed with the taxonomy. Use it to fetch one level at a time (lazy tree loading) or to find terms by any field.

---

### Get a term's children

**Goal:** the user expanded *Indoors* — load what is directly under it.

```tsx
const { data } = useFindTermsChildrenQuery({
  taxonomyName: 'services',
  parentId: 'term_indoors',
});
```

```json
{
  "list": {
    "items": [
      {
        "id": "term_air_con",
        "taxonomyName": "services",
        "parentId": "term_indoors",
        "order": 1,
        "name": "Air conditioning",
        "multiParents": [
          { "taxonomyId": "tax_service_types", "parentId": "term_indoors",          "name": "Indoors" },
          { "taxonomyId": "tax_service_types", "parentId": "term_energy_efficient", "name": "Energy efficient" }
        ]
      }
    ],
    "hasMore": false, "hasPrevious": false
  },
  "responseStatus": { "isSuccess": true }
}
```

This returns **both** direct children (their `parentId` is `term_indoors`) **and** multi-parent children (terms that list `term_indoors` in `multiParents`). Parent names are already resolved, so no second lookup.

---

### Multi-parent: one product in several categories

**Goal:** in a `products` taxonomy, a *Relaxing massage oil* belongs to *For couples*, *Gift ideas*, **and** *Body care*. Listing the children of **any** of those categories returns it.

```tsx
const { data } = useFindTermsChildrenQuery({
  taxonomyName: 'products',
  parentId: 'term_gift_ideas',
});
```

```json
{
  "list": {
    "items": [
      {
        "id": "term_relaxing_oil",
        "taxonomyName": "products",
        "name": "Relaxing massage oil",
        "multiParents": [
          { "taxonomyId": "tax_categories", "parentId": "term_for_couples", "name": "For couples" },
          { "taxonomyId": "tax_categories", "parentId": "term_gift_ideas",  "name": "Gift ideas" },
          { "taxonomyId": "tax_categories", "parentId": "term_body_care",   "name": "Body care" }
        ]
      }
    ],
    "hasMore": false, "hasPrevious": false
  },
  "responseStatus": { "isSuccess": true }
}
```

One product, three category links — no duplicate listings. The same product would also come back from the children of `term_for_couples` and `term_body_care`.

---

### Get the whole term tree in one call

**Goal:** render the full `services` tree at once, already nested.

```tsx
const { data } = useFindTermTreeQuery({ taxonomyName: 'services' });
```

```json
{
  "tree": [
    {
      "id": "term_indoors",
      "name": "Indoors",
      "order": 1,
      "children": [
        {
          "id": "term_air_con",
          "name": "Air conditioning",
          "order": 1,
          "children": [
            { "id": "term_wall", "name": "Wall-mounted", "order": 1, "children": null }
          ]
        }
      ]
    },
    {
      "id": "term_outdoors",
      "name": "Outdoors",
      "order": 2,
      "children": [
        { "id": "term_solar", "name": "Solar panels", "order": 1, "children": null }
      ]
    }
  ],
  "responseStatus": { "isSuccess": true }
}
```

Roots are in `tree`; each node carries its own `children`; a leaf has `children: null`. The tree arrives ready to render — no client-side tree building.

---

### Get only a sub-tree, capped by depth

**Goal:** start from *Indoors* and go at most 2 levels deep.

```tsx
const { data } = useFindTermTreeQuery({
  taxonomyName: 'services',
  rootTermId: 'term_indoors',
  depth: 2,
});
```

```json
{
  "tree": [
    {
      "id": "term_indoors",
      "name": "Indoors",
      "order": 1,
      "children": [
        { "id": "term_air_con", "name": "Air conditioning", "order": 1, "children": null }
      ]
    }
  ],
  "responseStatus": { "isSuccess": true }
}
```

With `depth: 2` you get *Indoors* (level 1) and *Air conditioning* (level 2); *Wall-mounted* (level 3) is cut off, so *Air conditioning* shows `children: null`.

---

### Get the taxonomy structure tree — without terms

**Goal:** see how taxonomies relate to each other (e.g. a `Cities` taxonomy whose parent is `Countries`), structure only.

```tsx
const { data } = useFindTaxonomyTreeQuery({});
```

```json
{
  "tree": [
    {
      "viewId": "txn_countries",
      "taxonomyName": "Countries",
      "taxonomySlug": "countries",
      "parentId": null,
      "children": [
        { "viewId": "txn_cities", "taxonomyName": "Cities", "taxonomySlug": "cities", "parentId": "txn_countries", "children": null, "terms": null }
      ],
      "terms": null
    }
  ],
  "responseStatus": { "isSuccess": true }
}
```

This is the **taxonomy** tree, not the term tree: nodes are taxonomies. Every `terms` is `null` because we did not ask for terms.

---

### Get the taxonomy structure tree — with terms

**Goal:** same structure, but also pull each taxonomy's terms in the same call.

```tsx
const { data } = useFindTaxonomyTreeQuery({ includeTerms: true });
```

```json
{
  "tree": [
    {
      "viewId": "txn_countries",
      "taxonomyName": "Countries",
      "taxonomySlug": "countries",
      "parentId": null,
      "terms": [
        { "id": "term_lt", "name": "Lithuania", "order": 1, "children": null },
        { "id": "term_lv", "name": "Latvia",    "order": 2, "children": null }
      ],
      "children": [
        {
          "viewId": "txn_cities",
          "taxonomyName": "Cities",
          "taxonomySlug": "cities",
          "parentId": "txn_countries",
          "terms": [
            { "id": "term_vilnius", "name": "Vilnius", "order": 1, "children": null },
            { "id": "term_kaunas",  "name": "Kaunas",  "order": 2, "children": null }
          ],
          "children": null
        }
      ]
    }
  ],
  "responseStatus": { "isSuccess": true }
}
```

Now each taxonomy node's `terms` holds that taxonomy's full term tree (same shape as `useFindTermTreeQuery`) — *Countries* carries its countries, *Cities* carries its cities.

> All four hooks also accept the usual RTK Query options (e.g. `{ skip: !ready }`), and an optional `databaseIntegrationId` in the argument to target a non-default database.

## Common patterns

### Skip a query until ready

```tsx
const projectId = useSelector(selectCurrentProjectId);
const { data } = useGetProjectQuery({ id: projectId }, { skip: !projectId });
```

### Reset the entire cache after login or tenant switch

```tsx
const dispatch = useDispatch();
const [login] = useLoginMutation();

async function handleLogin(creds) {
  await login(creds).unwrap();
  // The login mutation already invalidates the most-affected tags.
  // For a hard reset across every cached endpoint, also do:
  dispatch(norbixApi.util.resetApiState());
}
```

### Use the SDK directly when RTK Query is overkill

```tsx
function ApiVersionBadge() {
  const norbix = useNorbix();
  const [v, setV] = useState<string>();
  useEffect(() => {
    norbix.api.echo.echo({}).then((r) => setV(r.gatewayVersion));
  }, [norbix]);
  return <small>API {v}</small>;
}
```

### Per-request scoping (SSR, multi-tenant)

```tsx
const tenantNorbix = useMemo(() => norbix.with({ projectId, accountId }), [projectId, accountId]);

return (
  <NorbixProvider client={tenantNorbix}>
    <Workspace />
  </NorbixProvider>
);
```

For RTK Query to follow tenant changes, recreate the API slice or pass a tenant-aware `getClient` resolver to `createNorbixApi`.

### Multi-region projects

A Norbix project spans one **primary region** plus any number of **additional regions**. Two concerns, two homes: *which region your requests target* is configured on the wrapped `norbix` client (this package inherits it — every hook just calls the client you passed to `createNorbixApi`), while *which regions a project spans* is managed through the two hooks below.

**Configure the target region on the wrapped client.**

```ts
// 1. At construction
const norbix = new Norbix({ region: 'nb-eu-germany' });

// 2. Via environment — `new Norbix()` picks it up automatically
//    NORBIX_REGION=nb-eu-germany

// 3. At runtime
norbix.setRegion('nb-eu-germany'); // all subsequent requests
norbix.setRegion(undefined); // clear — the backend uses the project's primary region
```

When a region is set, every request carries the `nb-region` header, and the client itself composes the regional base URL (`https://nb-eu-germany.api.norbix.dev`) — but only when it is using the SDK's default base URLs; a custom `baseUrl` is never rewritten. There is no default region: with nothing set, no header is sent and the backend picks the project's primary region. The underlying SDK also accepts a per-call override (`norbix.hub.regions.list({}, { region: 'nb-eu-germany' })`); the shipped hooks don't expose that option, so for a one-off cross-region call drop down to the SDK via `useNorbix()`.

**Switching regions does not refetch by itself.** Same caveat as the tenant switch above: RTK Query keys its cache by endpoint + args, and the region is part of neither. After `norbix.setRegion(...)`, data cached from the old region stays in the store until something invalidates it. Reset the cache the same way you would after a tenant switch:

```tsx
norbix.setRegion('nb-eu-germany');
dispatch(norbixApi.util.resetApiState()); // hard reset of every cached endpoint
// or, surgically:
dispatch(norbixApi.util.invalidateTags(['Regions', 'Projects']));
```

**Manage the regions a project spans.**

```tsx
import { useListRegionsQuery, useUpdateProjectRegionsMutation } from './norbix';

function RegionSettings({ projectId }: { projectId: string }) {
  // GET /account/regions — the regions available to the account
  const { data, isLoading } = useListRegionsQuery({});
  // PATCH /account/projects/{projectId}/settings/regions
  const [updateRegions, { isLoading: saving }] = useUpdateProjectRegionsMutation();

  if (isLoading) return <p>Loading…</p>;

  return (
    <select
      disabled={saving}
      onChange={(e) =>
        updateRegions({
          projectId,
          primaryRegion: e.target.value, // a region code, e.g. "nb-eu-germany"
          additionalRegions: [],
        })
      }
    >
      {data?.items?.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name ?? r.id}
        </option>
      ))}
    </select>
  );
}
```

- `useListRegionsQuery` wraps `norbix.hub.regions.list` and **provides the `Regions` tag**. As with every query hook, a lazy variant — `useLazyListRegionsQuery` — is generated alongside it.
- `useUpdateProjectRegionsMutation` wraps `norbix.hub.regions.updateProjectRegions({ projectId, primaryRegion?, additionalRegions? })` and **invalidates `Regions` and `Projects`** — changing the regions a project spans updates the project DTO (`primaryRegion` / `additionalRegions`), so cached region lists *and* project queries refetch automatically once the mutation resolves.

> `hub.account` carries `getAccountRegions` / `updateProjectRegions` aliases for the same wire endpoints (`useGetAccountRegionsQuery` tags `Account`). The `hub.regions` hooks above are the canonical pair — they are the ones wired to the `Regions` tag.

### Wire all the `*Integrations` modules in one line each

Almost every Hub module exposes the same integrations CRUD surface (`getXIntegrations`, `saveXIntegration`, `enableXIntegration`, ...). Instead of copy-pasting ~50 lines per module, use `buildIntegrationsEndpoints`. The package already uses it for `hub.database`; wire the other 8 in your app via `injectEndpoints`:

```ts
import { norbixApi, buildIntegrationsEndpoints } from '@norbix/react-redux';

norbixApi.injectEndpoints({
  endpoints: (b) => ({
    // Email integrations live on hub.notifications (not hub.email)
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Email',
      tag: 'EmailIntegrations',
      namespace: (n) => n.hub.notifications,
      include: { test: true, confirmHumanDelivery: true },
    }),
    // Push integrations
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Push',
      tag: 'PushIntegrations',
      namespace: (n) => n.hub.notifications,
      include: { test: true, confirmHumanDelivery: true },
    }),
    // Sms integrations
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Sms',
      tag: 'SmsIntegrations',
      namespace: (n) => n.hub.notifications,
      include: { test: true, confirmHumanDelivery: true },
    }),
    // Files integrations
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Files',
      tag: 'FilesIntegrations',
      namespace: (n) => n.hub.files,
      include: { test: true },
    }),
    // Payments integrations
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Payments',
      tag: 'PaymentIntegrations',
      namespace: (n) => n.hub.payments,
      include: { test: true, confirmHumanDelivery: true },
    }),
    // Code integrations
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Code',
      tag: 'CodeIntegrations',
      namespace: (n) => n.hub.code ?? (n.hub as never),
      include: { test: true },
    }),
    // Membership integrations
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Membership',
      tag: 'MembershipIntegrations',
      namespace: (n) => n.hub.membership,
      include: { test: false },
    }),
    // Logs integrations — uses the `Logging` SDK prefix, not `Logs`
    ...buildIntegrationsEndpoints(b, {
      prefix: 'Logging',
      tag: 'LogsIntegrations',
      namespace: (n) => n.hub.logs,
      include: { test: false },
    }),
  }),
  overrideExisting: false,
});
```

This produces all hooks automatically — `useGetEmailIntegrationsQuery`, `useSaveEmailIntegrationMutation`, `useTestEmailIntegrationMutation`, `useConfirmEmailIntegrationHumanDeliveryMutation`, and the same for push/sms/files/payments/etc.

| Module | Prefix | Namespace | Tag | Notes |
|---|---|---|---|---|
| Email | `Email` | `n.hub.notifications` | `EmailIntegrations` | has `test` + `confirmHumanDelivery` |
| Push | `Push` | `n.hub.notifications` | `PushIntegrations` | has `test` + `confirmHumanDelivery` |
| Sms | `Sms` | `n.hub.notifications` | `SmsIntegrations` | has `test` + `confirmHumanDelivery` |
| Files | `Files` | `n.hub.files` | `FilesIntegrations` | has `test` |
| Payments | `Payments` | `n.hub.payments` | `PaymentIntegrations` | has `test` + `confirmHumanDelivery` |
| Code | `Code` | `n.hub.code` | `CodeIntegrations` | has `test` |
| Membership | `Membership` | `n.hub.membership` | `MembershipIntegrations` | no `test` |
| Logs | `Logging` *(uses `Logging`, not `Logs`)* | `n.hub.logs` | `LogsIntegrations` | no `test` |
| Database | `Database` | `n.hub.database` | `DatabaseIntegrations` | already wired in package |

**Trade-off.** The helper is terse but loses static request/response typing — generated hooks return `any` data, because endpoint keys are computed at runtime. If you need full types on a specific integration surface (autocompletion in your IDE), define those endpoints manually instead, following the canonical shape used by `hub.database` integrations in `src/hooks/hub/database.ts`.

### Add your own endpoints with `injectEndpoints`

The package ships a curated set of hooks. When your app needs an endpoint we don't expose, you can add it without forking — `createNorbixApi` returns the standard RTK Query API object, so `injectEndpoints` works exactly as documented in the [RTK Query docs](https://redux-toolkit.js.org/rtk-query/api/created-api/code-splitting):

```ts
// src/services/myCampaigns.ts
import { norbixApi } from '../norbix';
import type { useNorbix } from '@norbix/react-redux';

export const myCampaignsService = norbixApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmailCampaigns: builder.query({
      query: (args) => (norbix) => norbix.hub.notifications
        ? norbix.hub.notifications.getEmailTemplates(args) // example only
        : Promise.resolve({}),
      providesTags: [{ type: 'EmailCampaigns', id: 'LIST' }],
    }),
    // ...more app-specific endpoints
  }),
  overrideExisting: false,
});

export const { useGetEmailCampaignsQuery } = myCampaignsService;
```

The injected endpoints share the same `baseQuery`, the same tag taxonomy, and the same Redux slice — they integrate fully with cache invalidation across the package's hooks and your own.

### Unwrap response envelopes with `selectFromResult` or `transformResponse`

Norbix gateway responses are envelopes — `{ list: { items: [...] } }`, `{ user: {...} }`, etc. The hooks return the envelope shape (matching the SDK return type). To get just the inner array or item in a component, use `selectFromResult`:

```tsx
const { users, isLoading } = useGetUsersQuery(args, {
  selectFromResult: ({ data, isLoading }) => ({
    users: data?.list?.result ?? [],
    isLoading,
  }),
});
```

Or unwrap once at the endpoint level via `transformResponse` (use `injectEndpoints` to add a project-specific variant):

```ts
norbixApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsersList: builder.query<UserDto[], Partial<GetUsersRequest>>({
      query: (args) => (norbix) => norbix.api.membership.getUsers(args),
      transformResponse: (res) => res.list?.result ?? [],
      providesTags: [{ type: 'MembershipUsers', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});
```

### Migrating from a hand-rolled `fetchBaseQuery` setup

If your app currently calls Norbix via `fetchBaseQuery({ baseUrl })` + a custom `prepareHeaders`, you're reinventing what the SDK already does (auth precedence, retries, error mapping, env loading, MCP-aligned shape). Migration sketch:

1. **Replace** `fetchBaseQuery` setup with `createNorbixApi(() => norbix)`.
2. **Mount** `<NorbixProvider client={norbix}>` once at app root, alongside the existing `<Provider store={store}>`.
3. **Migrate per-service file**: rewrite each `api.injectEndpoints({ endpoints: builder => ({ getX: builder.query(...) }) })` from `url + method + body` to the `query: (args) => (norbix) => norbix.api.<module>.<method>(args)` shape. Keep the same `providesTags` / `invalidatesTags`.
4. **Remove** the custom error interceptor — `createNorbixBaseQuery` already maps `NorbixError` to `SerializedNorbixError` with `code`, `status`, `message`, `fieldErrors`. Consume those in your error UI instead.
5. **Keep** the same tag taxonomy — the package exports the full set (`Account`, `Projects`, `Regions`, `MembershipUsers`, `DatabaseSchemas`, ... 59 in total), so existing `providesTags` keep working.

## How it works under the hood

`createNorbixApi(getClient)` returns an RTK Query API. Its `baseQuery` is a thin wrapper that calls a closure you pass at endpoint definition time:

```ts
// inside @norbix/react-redux
const baseQuery = async (call) => {
  try {
    return { data: await call(getClient()) };
  } catch (err) {
    return { error: serializeNorbixError(err) };
  }
};
```

Every endpoint is shaped like:

```ts
getUsers: b.query({
  query: (args) => (norbix) => norbix.api.membership.getUsers(args),
  providesTags: [{ type: 'User', id: 'LIST' }],
}),
```

The closure carries the args and runs against the live SDK. Types come from the SDK's own method signatures via small `Result<F>` / `Arg<F>` helpers — no DTO imports required.

## Development

```sh
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Conventional commits are required. Pushes to `main` are released to npm by [semantic-release](https://github.com/semantic-release/semantic-release) with provenance enabled. `next` and `beta` branches publish prereleases.

## License

[MIT](./LICENSE) © Norbix
