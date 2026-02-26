import { test, expect } from '@playwright/test'

test('form submit then appears in table', async ({ page }) => {
  await page.goto('/form')
  await page.getByLabel('姓名').fill('NightRunner')
  await page.getByLabel('电话').fill('13800138000')
  await page.getByLabel('邮箱').fill('night@example.com')
  await page.getByRole('button', { name: '提交' }).click()

  await page.getByRole('menuitem', { name: '表格' }).click()
  await expect(page.getByText('NightRunner')).toBeVisible()
})

test('table delete flow works', async ({ page }) => {
  await page.goto('/form')
  await page.getByLabel('姓名').fill('DeleteMe')
  await page.getByLabel('电话').fill('13800138001')
  await page.getByLabel('邮箱').fill('deleteme@example.com')
  await page.getByRole('button', { name: '提交' }).click()

  await page.getByRole('menuitem', { name: '表格' }).click()
  const row = page.locator('tr', { hasText: 'DeleteMe' })
  await expect(row).toBeVisible()

  await row.getByRole('button', { name: '删除' }).click()
  await page.locator('.el-message-box__btns .el-button--primary').click()

  await expect(page.locator('tr', { hasText: 'DeleteMe' })).toHaveCount(0)
})
