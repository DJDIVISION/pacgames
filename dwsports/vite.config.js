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
    createHtmlPlugin({
      inject: {
        data: {
          version: '1.0.1', // Add your app version here
        },
      },
    }),
  ],
  optimizeDeps: {
    include: ['@tonconnect/ui-react']
  },
  build: {
    assetsInlineLimit: 0, // Optional, ensures assets aren't inlined
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
