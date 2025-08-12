import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
   server: {
    proxy: {
      '/api': {
        target: 'https://flowers-vert-six.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
         secure: false
      },
    },
  },
  plugins: [react()],
})
