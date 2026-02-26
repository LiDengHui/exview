import { describe, expect, it } from 'vitest'
import { userMockApi } from './users'

describe('userMockApi', () => {
  it('adds user correctly', async () => {
    const created = await userMockApi.add({
      name: 'Casey',
      age: 26,
      phone: '13800000009',
      email: 'casey@example.com'
    })
    expect(created.id).toBeTypeOf('number')
    const all = await userMockApi.list()
    expect(all.some((u) => u.email === 'casey@example.com')).toBe(true)
  })

  it('removes user correctly', async () => {
    const created = await userMockApi.add({
      name: 'Temp',
      age: 20,
      phone: '13800000010',
      email: 'temp@example.com'
    })
    await userMockApi.remove(created.id)
    const all = await userMockApi.list()
    expect(all.some((u) => u.id === created.id)).toBe(false)
  })
})
