// @ts-check
import { defineConfig } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://guiawc26-fes.netlify.app',
  integrations: [
    sitemap(),
    AstroPWA({
      injectRegister: 'script',
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.png', 
        'robots.txt', 
        'apple-touch-icon.png', 
        'pwa-500x500.png',
        'screenshot-mobile.png'
      ],
      manifest: {
        name: 'Guía para Aficionados - World Cup 2026',
        short_name: 'Guía Aficionados',
        description: 'Guía para aficionados al fútbol. Mapas offline y alertas.',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-500x500.png',
            sizes: '500x500',
            type: 'image/png',
          },
          {
            src: 'pwa-500x500.png',
            sizes: '500x500',
            type: 'image/png',
            purpose: 'maskable',
          }
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '500x500',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Interfaz Móvil'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
