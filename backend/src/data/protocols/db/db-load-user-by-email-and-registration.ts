import { User } from '@/domain/model/user'

export interface DbLoadUserByEmailAndRegistration{
  loadByEmailAndRegistration(email: string, registration: string): Promise<User>
}
