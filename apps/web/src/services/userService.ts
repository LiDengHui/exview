import { userMockApi, type UserItem } from '../mock/users'
import { http } from './http'

export interface CreateUserPayload {
  name: string
  age: number
  phone: string
  email: string
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

interface UserListResponse {
  data: UserItem[]
}

interface UserItemResponse {
  data: UserItem
}

export const userService = {
  list: async (): Promise<UserItem[]> => {
    if (USE_MOCK) return userMockApi.list()
    const res = await http<UserListResponse>('/users')
    return res.data
  },
  add: async (payload: CreateUserPayload): Promise<UserItem> => {
    if (USE_MOCK) return userMockApi.add(payload)
    const res = await http<UserItemResponse>('/users', { method: 'POST', body: payload })
    return res.data
  },
  remove: async (id: number): Promise<boolean> => {
    if (USE_MOCK) return userMockApi.remove(id)
    await http<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' })
    return true
  }
}
