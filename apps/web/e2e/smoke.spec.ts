import { test, expect } from '@playwright/test'

test('home and routes smoke', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Exview Modernized')).toBeVisible()

  await page.goto('/form')
  await expect(page.getByRole('heading', { name: '表单迁移版' })).toBeVisible()

  await page.goto('/table')
  await expect(page.getByRole('heading', { name: '表格迁移版' })).toBeVisible()
})
