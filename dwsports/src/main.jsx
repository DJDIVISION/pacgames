import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import BetsContext from './context/BetsContext.jsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SocketsContext from './context/SocketsContext.jsx'

console.log('Manifest URL:', `${window.location.origin}/tonconnect-manifest.json`);

createRoot(document.getElementById('root')).render(
  <>
    {/* <TonConnectUIProvider manifestUrl={`https://pacgames-nu.vercel.app/tonconnect-manifest.json`}> */}
    <BetsContext>
      <SocketsContext>
        <App />
      </SocketsContext>
    </BetsContext>
    {/* </TonConnectUIProvider> */}
  </>,
)
