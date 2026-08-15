import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs so the build runs from any sub-path a QR code points at.
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
