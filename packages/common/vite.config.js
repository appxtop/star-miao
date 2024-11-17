// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig(option => ({
    build: {
        target: 'esnext',
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            formats: ['es'],
            fileName: (format) => `${format}.js`,
        },
        minify: false
    }
}))