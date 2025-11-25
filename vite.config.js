import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      'drf-golas.cleilsonalvino.com.br',
      'api-drf-golas.cleilsonalvino.com.br'
    ]
  }
})
