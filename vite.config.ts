import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { routePages } from './scripts/route-pages.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routePages()],
})
