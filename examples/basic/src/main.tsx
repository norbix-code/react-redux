import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { NorbixProvider } from '@norbix/react-redux';

import { App } from './App';
import { norbix } from './norbix';
import { store } from './store';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

createRoot(root).render(
  <StrictMode>
    {/* Redux store first — RTK Query lives inside it. */}
    <ReduxProvider store={store}>
      {/* NorbixProvider exposes the SDK client to descendants via useNorbix(). */}
      <NorbixProvider client={norbix}>
        <App />
      </NorbixProvider>
    </ReduxProvider>
  </StrictMode>,
);
