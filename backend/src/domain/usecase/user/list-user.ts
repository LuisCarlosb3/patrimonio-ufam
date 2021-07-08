import { User } from '@/domain/model/user'

export interface LoadUserList {
  load(page?: number): Promise<User[]>
}
