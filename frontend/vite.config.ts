import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Ar Todo List',
        description: "ArList todo list application",
        short_name: 'ArList',
        theme_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.jpg',
            sizes: '1080x2400',
            type: 'image/png',
            platform: 'narrow',
            label: 'The application screenshot'
          }
        ]
      }
    })
  ],
  server: {
    host: '::',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: [
        'todo.arorms.cn'
    ]
  }
})
