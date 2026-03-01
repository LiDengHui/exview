import { describe, expect, it } from 'vitest'
import { adaptUserItemResponse, adaptUserListResponse } from './adapters/userAdapter'

describe('userAdapter', () => {
  it('adapts list from data/list/items payloads', () => {
    expect(adaptUserListResponse({ data: [{ id: '1', name: 'A', age: '18', phone: '1', email: 'a@x.com' }] })[0].id).toBe(1)
    expect(adaptUserListResponse({ list: [{ id: 2, name: 'B', age: 20, phone: '2', email: 'b@x.com' }] })).toHaveLength(1)
    expect(adaptUserListResponse({ items: [{ id: 3, name: 'C', age: 30, phone: '3', email: 'c@x.com' }] })).toHaveLength(1)
  })

  it('adapts single item from data/item payload', () => {
    expect(adaptUserItemResponse({ data: { id: '7', name: 'U', age: '21', phone: '7', email: 'u@x.com' } }).id).toBe(7)
    expect(adaptUserItemResponse({ item: { id: 8, name: 'V', age: 22, phone: '8', email: 'v@x.com' } }).id).toBe(8)
  })
})
