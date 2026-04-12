import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), cloudflare()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-helmet';
          
          // Page chunks by role
          if (id.includes('pages/auth')) return 'chunk-auth';
          if (id.includes('pages/coordinator')) return 'chunk-coordinator';
          if (id.includes('pages/instructor')) return 'chunk-instructor';
          if (id.includes('pages/shared')) return 'chunk-shared';
          
          // Component chunks
          if (id.includes('api/client')) return 'chunk-api';
          if (id.includes('context/AuthContext')) return 'chunk-context';
          if (id.includes('components/ui')) return 'chunk-ui';
        },
      },
    },
  },
})