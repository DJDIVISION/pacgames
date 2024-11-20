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

/* if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
} */


console.log('Manifest URL:', `${window.location.origin}/tonconnect-manifest.json`);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js')
      .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((err) => {
          console.error('Service Worker registration failed:', err);
      });
}

createRoot(document.getElementById('root')).render(
  <>
    <TonConnectUIProvider manifestUrl={`https://pacgames-frontend.onrender.com/tonconnect-manifest.json`}>
    <I18nextProvider i18n={i18next}>
    <FantasyContext>
    <BetsContext>
      <SocketsContext>
        <RouletteContext>
          
        <App />
        
        </RouletteContext>
      </SocketsContext>
    </BetsContext>
    </FantasyContext>
    </I18nextProvider>
    </TonConnectUIProvider>
  </>,
)
