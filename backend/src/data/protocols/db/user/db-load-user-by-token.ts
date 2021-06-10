import { User } from '@/domain/model/user'

export interface LoadUserByTokenRepository {
  loadByToken(token: string, permission?: number): Promise<User>
}
