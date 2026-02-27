import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
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
    Components({
      resolvers: [ElementPlusResolver({ importStyle: false })]
    })
  ],
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    globals: true
  }
})
