import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    svgr(),
    VitePWA({
      workbox: {
        // Increase the maximum file size to cache (e.g., 4 MB)
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 4 MB in bytes
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pacton Gaming Zone',
        short_name: 'Pacton GZ',
        description: 'A new Era of Gaming and Sports Betting',
        theme_color: 'black',
        "icons": [
      
      {
        "src": "icon-72x72.png",
        "type": "image/png",
        "sizes": "72x72"
      },
      {
        "src": "icon-96x96.png",
        "type": "image/png",
        "sizes": "96x96"
      },
      {
        "src": "icon-128x128",
        "type": "image/png",
        "sizes": "128x128"
      },
      {
        "src": "icon-144x144.png",
        "type": "image/png",
        "sizes": "144x144"
      },
      {
        "src": "icon-152x152.png",
        "type": "image/png",
        "sizes": "152x152"
      },
      {
        "src": "icon-192x192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "icon-384x384.png",
        "type": "image/png",
        "sizes": "384x384"
      },
      {
        "src": "icon-512x512.png",
        "type": "image/png",
        "sizes": "512x512"
      },
      {
        "src": "mask120.png",
        "type": "image/png",
        "sizes": "120x120",
        "purpose": "maskable"
      },
      {
        "src": "mask180.png",
        "type": "image/png",
        "sizes": "180x180",
        "purpose": "maskable"
      }
    ],
      },
      devOptions: {
        enabled: true, // Enable for development mode if necessary
      },
    }),
  ],
  optimizeDeps: {
    include: ['@tonconnect/ui-react']
  }
})
