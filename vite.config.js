import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['estoque-golas.onrender.com'], // Permite o host especificado
  },
  base: '/', // Adicione essa linha para garantir que os recursos sejam encontrados corretamente
})
