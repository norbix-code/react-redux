# `@norbix/react-redux` — basic example

A small Vite + React + Redux Toolkit app showing the package end-to-end. Three panels:

| Panel | Hook(s) used | Pattern |
|---|---|---|
| Login | `useLoginMutation`, `useLogoutMutation` | Auth flow that mutates client state and invalidates `MembershipUsers/LIST` and `Account/Profile`. |
| Users | `useGetUsersQuery` + `useInviteUserMutation` + `useBlockUserMutation` + `useUnblockUserMutation` + `useDeleteUserMutation` | Paginated read with auto-refetch on every write (tag-based invalidation). Uses `selectFromResult` to unwrap the `{ list: { result } }` envelope. |
| Collection | `useFindCollectionQuery` | Per-collection cache key — flipping the collection name fires a new request, flipping back is instant from cache. |

Plus a small `<ErrorBox>` component that consumes `SerializedNorbixError` to render `code`, `message`, and per-field validation errors uniformly.

## Run it

```sh
# 1. From the package root, build the workspace dep:
cd ../..      # back to norbix-react-redux/
npm install
npm run build

# 2. Then this example:
cd examples/basic
npm install
cp .env.example .env.local
# Edit .env.local with a project ID + API key from cloud.norbix.ai
npm run dev
```

Open http://localhost:5173. Sign in (or use an API key directly via `.env.local`) and watch the users list refetch automatically after Invite / Block / Delete.

## Key files

| File | Purpose |
|---|---|
| `src/norbix.ts` | Builds the Norbix SDK client and the RTK Query API slice. Re-exports the hooks. |
| `src/store.ts` | Standard `configureStore` — adds `norbixApi.reducer` and `norbixApi.middleware`. |
| `src/main.tsx` | Bootstraps the providers: `<ReduxProvider store={...}>` then `<NorbixProvider client={...}>`. |
| `src/App.tsx` | Renders the three panels. |
| `src/components/*Panel.tsx` | The actual demo flows. |
| `src/components/ErrorBox.tsx` | Reusable typed error renderer. |

## What you might add next

- **Optimistic updates** on `useUpdateUserMutation` via `onQueryStarted` — RTK Query supports it; the package doesn't need to do anything special.
- **Polling** on the users list: pass `pollingInterval: 30_000` to `useGetUsersQuery`.
- **Per-tenant client.** Replace the constant `getClient` resolver in `createNorbixApi` with one that reads the current tenant id from Redux and calls `norbix.with({ projectId })` per-request.
- **`buildIntegrationsEndpoints`**: wire `EmailIntegrations`, `PushIntegrations`, etc. via `injectEndpoints` — see the package README.
