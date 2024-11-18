import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 1111,
    proxy: {
      "/socket": {
        target: "http://localhost:1088/socket",
        ws: true
      },
      '/api': {
        target: 'http://localhost:1088/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [vue()],
})
