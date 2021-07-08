import { User } from '@/domain/model/user'
export interface LoadUserListMode extends Omit<User, 'password'>{}
export interface LoadUserList {
  load(page?: number): Promise<LoadUserListMode[]>
}
