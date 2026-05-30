import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'], 
      include: ['src/**/*.{js,jsx}'], // Qué archivos medir
      exclude: ['src/main.jsx', 'src/**/*.test.{js,jsx}', 'src/assets/**'] // Qué ignorar
    }
  }
})