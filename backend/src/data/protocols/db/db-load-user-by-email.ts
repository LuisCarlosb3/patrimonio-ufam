import { User } from '@/domain/model/user'

export interface DbLoadUserByEmail{
  loadByEmail(email: string): Promise<User>
}
