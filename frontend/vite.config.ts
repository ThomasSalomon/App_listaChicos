import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Intentar cargar certificados SSL si existen
function getHttpsConfig() {
  try {
    return {
      key: readFileSync(resolve(__dirname, 'certs/key.pem')),
      cert: readFileSync(resolve(__dirname, 'certs/cert.pem'))
    }
  } catch {
    return undefined // Cambiar de false a undefined
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Usar rutas relativas para Electron
  server: {
    host: '0.0.0.0', // Permitir conexiones desde cualquier IP
    port: 3000,      // Puerto específico
    strictPort: true, // No cambiar puerto automáticamente
    cors: true,      // Habilitar CORS
    https: getHttpsConfig() // HTTPS si hay certificados
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})
