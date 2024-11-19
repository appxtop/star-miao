import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 自定义拆分逻辑  
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // 将node_modules中的依赖拆分到单独的包中  
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }

      }

    },
  },

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
