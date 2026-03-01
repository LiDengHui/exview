import { test, expect } from '@playwright/test'

const routeCases = [
  { path: '/', text: 'Exview 已迁移到 Vue 3 + Vite + pnpm workspace' },
  { path: '/form', text: '表单迁移版' },
  { path: '/table', text: '表格迁移版' },
  { path: '/menu', text: '菜单迁移版' },
  { path: '/toolbar', text: '工具栏迁移版' },
  { path: '/schema-playground', text: 'Schema JSON' },
  { path: '/schema-examples', text: 'SchemaForm 使用用例' },
  { path: '/schema-dynamic', text: '组件动态变化用例' },
  { path: '/schema-advanced', text: '高级能力用例' }
]

test('route-level pages are reachable by URL', async ({ page }) => {
  for (const item of routeCases) {
    await page.goto(item.path)
    await expect(page.getByText(item.text).first()).toBeVisible()
  }
})
