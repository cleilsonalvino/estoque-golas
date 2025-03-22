import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './' // Isso faz o Vite procurar o arquivo index.html na raiz do projeto
})
