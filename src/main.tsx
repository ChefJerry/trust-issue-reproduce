import React from 'react'
import ReactDOM from 'react-dom/client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import App from './App.tsx'
import { WagmiProvider, serialize, deserialize } from 'wagmi'
import { config } from './wagmi.ts'

import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: { networkMode: 'offlineFirst' },
  },
})

const persister = createSyncStoragePersister({
  key: 'vite-react.cache',
  serialize,
  storage: window.localStorage,
  deserialize,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <App />
      </PersistQueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
