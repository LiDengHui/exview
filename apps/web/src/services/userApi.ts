import { http } from './http'
import type { UserItem } from '../mock/users'
import type { CreateUserPayload } from './userTypes'
import {
  adaptUserItemResponse,
  adaptUserListResponse,
  toApiCreateUserPayload,
  type ApiUserItemResponse,
  type ApiUserListResponse
} from './adapters/userAdapter'

export const userApi = {
  async list(): Promise<UserItem[]> {
    const res = await http<ApiUserListResponse | UserItem[]>('/users')
    return adaptUserListResponse(res)
  },
  async add(payload: CreateUserPayload): Promise<UserItem> {
    const res = await http<ApiUserItemResponse | UserItem>('/users', {
      method: 'POST',
      body: toApiCreateUserPayload(payload)
    })
    return adaptUserItemResponse(res)
  },
  async remove(id: number): Promise<boolean> {
    await http<{ success?: boolean }>(`/users/${id}`, { method: 'DELETE' })
    return true
  }
}
