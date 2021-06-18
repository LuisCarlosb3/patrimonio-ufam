import { User } from '@/domain/model/user'

export interface LoadUserById {
  load(id: string): Promise<User>
}
