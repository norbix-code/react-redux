import type { Norbix } from 'norbix';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * React context that carries the live Norbix client. Used by `useNorbix()` and
 * by `createNorbixApi`'s default `getClient` resolver.
 *
 * NOTE: this context only stores the client. The RTK Query API slice still
 * lives in your Redux store — `<NorbixProvider>` does **not** replace
 * `<Provider store={store}>`. You wrap with both.
 */
const NorbixContext = createContext<Norbix | null>(null);

export interface NorbixProviderProps {
  /** The Norbix SDK client instance. Construct it once at app startup. */
  client: Norbix;
  children?: ReactNode;
}

/**
 * Make the Norbix client available to descendant components and to any
 * RTK Query API created via `createNorbixApi(() => useNorbix())` style
 * resolvers.
 *
 * @example
 * ```tsx
 * const norbix = new Norbix({ apiKey, projectId });
 * const norbixApi = createNorbixApi(() => norbix);
 *
 * const store = configureStore({
 *   reducer: { [norbixApi.reducerPath]: norbixApi.reducer },
 *   middleware: (gDM) => gDM().concat(norbixApi.middleware),
 * });
 *
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <NorbixProvider client={norbix}>
 *         <Routes />
 *       </NorbixProvider>
 *     </Provider>
 *   );
 * }
 * ```
 */
export function NorbixProvider({ client, children }: NorbixProviderProps) {
  // Stable identity: re-render only when the client identity actually changes.
  const value = useMemo(() => client, [client]);
  return <NorbixContext.Provider value={value}>{children}</NorbixContext.Provider>;
}

/**
 * Read the Norbix client from context. Throws if used outside `<NorbixProvider>`.
 *
 * Useful for code that wants the typed SDK directly — for example, a one-off
 * call inside an effect, or a non-Redux feature like `client.login(...)`:
 *
 * ```tsx
 * function LoginButton() {
 *   const norbix = useNorbix();
 *   return <button onClick={() => norbix.login({ userName, password })}>Sign in</button>;
 * }
 * ```
 */
export function useNorbix(): Norbix {
  const client = useContext(NorbixContext);
  if (!client) {
    throw new Error(
      '@norbix/react-redux: useNorbix() must be called inside <NorbixProvider client={...}>.',
    );
  }
  return client;
}

/**
 * Optional non-throwing variant. Returns `null` when not inside a provider.
 * Useful for SSR / fallback rendering paths.
 */
export function useOptionalNorbix(): Norbix | null {
  return useContext(NorbixContext);
}
