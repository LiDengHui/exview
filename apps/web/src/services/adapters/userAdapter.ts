import type { UserItem } from '../../mock/users'
import type { CreateUserPayload } from '../userTypes'

export interface ApiUser {
  id?: number | string
  name?: string
  age?: number | string
  phone?: string
  email?: string
}

export interface ApiUserListResponse {
  data?: ApiUser[]
  list?: ApiUser[]
  items?: ApiUser[]
}

export interface ApiUserItemResponse {
  data?: ApiUser
  item?: ApiUser
}

function toNumber(value: unknown, fallback = 0): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function adaptUser(input: ApiUser): UserItem {
  return {
    id: toNumber(input.id, 0),
    name: String(input.name ?? ''),
    age: toNumber(input.age, 0),
    phone: String(input.phone ?? ''),
    email: String(input.email ?? '')
  }
}

export function adaptUserListResponse(payload: ApiUserListResponse | ApiUser[]): UserItem[] {
  const list = Array.isArray(payload)
    ? payload
    : payload.data || payload.list || payload.items || []
  return list.map(adaptUser)
}

export function adaptUserItemResponse(payload: ApiUserItemResponse | ApiUser): UserItem {
  const item = ('data' in (payload as ApiUserItemResponse) || 'item' in (payload as ApiUserItemResponse))
    ? ((payload as ApiUserItemResponse).data || (payload as ApiUserItemResponse).item || {})
    : payload
  return adaptUser(item as ApiUser)
}

export function toApiCreateUserPayload(payload: CreateUserPayload): Record<string, unknown> {
  return {
    name: payload.name,
    age: payload.age,
    phone: payload.phone,
    email: payload.email
  }
}
