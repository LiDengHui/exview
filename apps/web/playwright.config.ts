import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:5178',
    headless: true
  },
  webServer: {
    command: 'pnpm dev --host 127.0.0.1 --port 5178',
    port: 5178,
    reuseExistingServer: true,
    timeout: 120000
  }
})
