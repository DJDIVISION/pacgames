import { Buffer } from 'buffer'; 
window.Buffer = Buffer;
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import BetsContext from './context/BetsContext.jsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SocketsContext from './context/SocketsContext.jsx'
import RouletteContext from './context/RouletteContext.jsx'
import FantasyContext from './context/FantasyContext.jsx'
import i18next from 'i18next';
import {I18nextProvider} from 'react-i18next';
import global_fr from "./components/translations/fr/global.json"
import global_es from "./components/translations/es/global.json"
import global_en from "./components/translations/en/global.json"


i18next.init ({
  interpolation: {escapeValue: false},
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    es: {
      global: global_es
    },
    fr: {
      global: global_fr
    },
    en: {
      global: global_en
    }
  },
})

console.log('Manifest URL:', `${window.location.origin}/tonconnect-manifest.json`);

createRoot(document.getElementById('root')).render(
  <>
    <TonConnectUIProvider manifestUrl={`https://pacgames-nu.vercel.app/tonconnect-manifest.json`}>
    <I18nextProvider i18n={i18next}>
    <BetsContext>
      <SocketsContext>
        <RouletteContext>
          <FantasyContext>
        <App />
        </FantasyContext>
        </RouletteContext>
      </SocketsContext>
    </BetsContext>
    </I18nextProvider>
    </TonConnectUIProvider>
  </>,
)
