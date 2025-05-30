import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }),
    vueJsx()
  ],
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      host: 'localhost'
    }
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
