import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // The agent loop runs the suite on every iteration, so cache transforms
    // between runs rather than re-transforming MUI each time.
    fsModuleCache: true,
  },
})
