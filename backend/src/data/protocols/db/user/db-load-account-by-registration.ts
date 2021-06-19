import { User } from '@/domain/model/user'

export interface DbLoadAccountByRegistration {
  loadByRegistration(registration: string): Promise<User>
}
