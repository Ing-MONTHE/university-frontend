import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Plugin Tailwind CSS 4.1
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Permet d'utiliser @/ pour importer
    },
  },
  server: {
    port: 3000, // Port du serveur de dev
    proxy: {
      // Proxy pour l'API backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
