import { userMockApi, type UserItem } from '../mock/users'

export interface CreateUserPayload {
  name: string
  age: number
  phone: string
  email: string
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const userService = {
  list: async (): Promise<UserItem[]> => {
    if (USE_MOCK) return userMockApi.list()
    // placeholder for real API
    return userMockApi.list()
  },
  add: async (payload: CreateUserPayload): Promise<UserItem> => {
    if (USE_MOCK) return userMockApi.add(payload)
    // placeholder for real API
    return userMockApi.add(payload)
  },
  remove: async (id: number): Promise<boolean> => {
    if (USE_MOCK) return userMockApi.remove(id)
    // placeholder for real API
    return userMockApi.remove(id)
  }
}
