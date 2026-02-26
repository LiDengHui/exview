import { describe, expect, it } from 'vitest'
import { userService } from './userService'

describe('userService', () => {
  it('list returns array', async () => {
    const rows = await userService.list()
    expect(Array.isArray(rows)).toBe(true)
  })
})
