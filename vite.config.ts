import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vegan.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Vegan Rehber',
        short_name: 'Vegan Rehber',
        description: 'Your guide to vegan products in supermarkets',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache all assets
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        // Enable offline mode
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/vegan-rehber\.netlify\.app\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vegan-rehber-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache'
            }
          }
        ]
      }
    })
  ]
});
