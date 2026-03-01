import { test, expect, type Page } from '@playwright/test'

async function fillByLabel(page: Page, label: string, value: string) {
  const formItem = page.locator('.el-form-item').filter({ has: page.locator('.el-form-item__label', { hasText: label }) }).first()
  await formItem.locator('input, textarea').first().fill(value)
}

test('condition DSL toggles admin note in dynamic schema page', async ({ page }) => {
  await page.goto('/schema-dynamic')

  const adminNote = page.locator('textarea[placeholder*="当用户名=admin"]')
  await expect(adminNote).toBeHidden()

  await fillByLabel(page, '用户名', 'admin')
  await expect(adminNote).toBeVisible()

  await fillByLabel(page, '用户名', 'guest')
  await expect(adminNote).toBeHidden()
})

test('persistKey restores values after reload in advanced page', async ({ page }) => {
  await page.goto('/schema-advanced')

  const usernameInput = page.locator('input[placeholder*="输入 admin 会报占用"]')
  await usernameInput.fill('persist-user')

  await page.reload()
  await expect(page.locator('input[placeholder*="输入 admin 会报占用"]')).toHaveValue('persist-user')
})

test('visibleMode if should mount/unmount field by DSL condition', async ({ page }) => {
  await page.goto('/schema-dynamic')

  const secretInput = page.locator('input[placeholder*="visibleMode=if"]')
  await expect(secretInput).toHaveCount(0)

  await fillByLabel(page, '用户名', 'admin')
  await expect(secretInput).toHaveCount(1)

  await fillByLabel(page, '用户名', 'guest')
  await expect(secretInput).toHaveCount(0)
})

test('advanced page exposes field loading/error status text', async ({ page }) => {
  await page.goto('/schema-advanced')

  const status = page.getByTestId('field-status')
  await expect(status).toContainText('loading=')
  await expect(status).toContainText('errors=')

  const usernameInput = page.locator('input[placeholder*="输入 admin 会报占用"]')
  await usernameInput.fill('status-user')

  await expect(status).toContainText('city')
})

test('runtime registered rule should validate username as required', async ({ page }) => {
  await page.goto('/schema-advanced')
  await page.locator('input[placeholder*="输入 admin 会报占用"]').fill('')
  await page.getByRole('button', { name: '校验用户名字段' }).click()
  await expect(page.locator('.el-message')).toContainText('校验失败')
})
