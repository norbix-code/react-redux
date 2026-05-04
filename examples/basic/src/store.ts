import { configureStore } from '@reduxjs/toolkit';

import { norbixApi } from './norbix';

/**
 * Standard Redux Toolkit store. The Norbix slice plugs in like any other
 * RTK Query API: add the reducer at `norbixApi.reducerPath`, append the
 * middleware to enable cache lifecycle / refetch-on-focus / etc.
 */
export const store = configureStore({
  reducer: {
    [norbixApi.reducerPath]: norbixApi.reducer,
    // ...your own slices here
  },
  middleware: (getDefault) => getDefault().concat(norbixApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
