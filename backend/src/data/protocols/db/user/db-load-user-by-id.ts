import { User } from '@/domain/model/user'

export interface DbLoadUserById {
  loadById(id: string): Promise<User>
}
