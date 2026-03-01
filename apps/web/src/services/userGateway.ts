import { userMockApi, type UserItem } from '../mock/users'
import { userApi } from './userApi'
import type { CreateUserPayload } from './userTypes'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const MOCK_FALLBACK = import.meta.env.VITE_MOCK_FALLBACK !== 'false'

async function withFallback<T>(task: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await task()
  } catch (error) {
    if (!MOCK_FALLBACK) throw error
    return fallback()
  }
}

export const userGateway = {
  list: async (): Promise<UserItem[]> => {
    if (USE_MOCK) return userMockApi.list()
    return withFallback(() => userApi.list(), () => userMockApi.list())
  },
  add: async (payload: CreateUserPayload): Promise<UserItem> => {
    if (USE_MOCK) return userMockApi.add(payload)
    return withFallback(() => userApi.add(payload), () => userMockApi.add(payload))
  },
  remove: async (id: number): Promise<boolean> => {
    if (USE_MOCK) return userMockApi.remove(id)
    return withFallback(() => userApi.remove(id), () => userMockApi.remove(id))
  }
}
