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
5. **Keep** the same tag taxonomy — the package exports the full set (`Account`, `Projects`, `MembershipUsers`, `DatabaseSchemas`, ... 47 in total), so existing `providesTags` keep working.

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
