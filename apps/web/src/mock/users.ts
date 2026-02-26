export interface UserItem {
  id: number
  name: string
  age: number
  phone: string
  email: string
}

let users: UserItem[] = [
  { id: 1, name: 'Alice', age: 28, phone: '13800000001', email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 32, phone: '13800000002', email: 'bob@example.com' }
]

export const userMockApi = {
  list: async () => Promise.resolve([...users]),
  add: async (payload: Omit<UserItem, 'id'>) => {
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1
    const row = { id, ...payload }
    users.push(row)
    return row
  },
  remove: async (id: number) => {
    users = users.filter((u) => u.id !== id)
    return true
  }
}
