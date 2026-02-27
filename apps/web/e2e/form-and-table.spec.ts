import { test, expect } from '@playwright/test'

test('form submit then appears in table', async ({ page }) => {
  await page.goto('/form')
  await page.getByRole('button', { name: '提交' }).click()

  await page.getByRole('menuitem', { name: '表格' }).click()
  await expect(page.locator('tbody tr')).toHaveCount(3)
})

test('table delete flow works', async ({ page }) => {
  await page.goto('/form')
  await page.getByRole('button', { name: '提交' }).click()

  await page.getByRole('menuitem', { name: '表格' }).click()
  const rows = page.locator('tbody tr')
  await expect(rows).toHaveCount(3)

  await rows.first().getByRole('button', { name: '删除' }).click()
  await page.locator('.el-message-box__btns .el-button--primary').click()

  await expect(rows).toHaveCount(2)
})
