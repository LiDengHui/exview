import type { UserItem } from '../mock/users'
import { userGateway } from './userGateway'
import type { CreateUserPayload } from './userTypes'

export type { CreateUserPayload }

export const userService = {
  list: async (): Promise<UserItem[]> => userGateway.list(),
  add: async (payload: CreateUserPayload): Promise<UserItem> => userGateway.add(payload),
  remove: async (id: number): Promise<boolean> => userGateway.remove(id)
}
