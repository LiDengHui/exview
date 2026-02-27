import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolveWorkspaceAlias } from './config/workspaceAlias'

export default defineConfig({
  resolve: {
    alias: resolveWorkspaceAlias(import.meta.url)
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
