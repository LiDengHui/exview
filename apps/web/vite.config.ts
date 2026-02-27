import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '@exview/schema-shared': fileURLToPath(new URL('../../packages/schema-shared/src/index.ts', import.meta.url)),
      '@exview/schema-form': fileURLToPath(new URL('../../packages/schema-form/src/index.ts', import.meta.url)),
      '@exview/schema-table': fileURLToPath(new URL('../../packages/schema-table/src/index.ts', import.meta.url))
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: false }
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'css' })],
      dts: 'src/components.d.ts'
    })
  ],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
