import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production'
    ? (process.env.GITHUB_REF === 'refs/heads/develop'
        ? '/Analyzer_for_AIE1901/develop/'
        : '/Analyzer_for_AIE1901/')
    : '/',
})
