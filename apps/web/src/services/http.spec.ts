import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { http } from './http'

describe('http', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.useRealTimers()
  })

  it('throws on non-ok response', async () => {
    global.fetch = vi.fn(async () => new Response('bad', { status: 500 })) as any
    await expect(http('/x')).rejects.toThrow('HTTP 500')
  })
})
