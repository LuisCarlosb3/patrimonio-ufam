import { User } from '@/domain/model/user'

export interface LoadUserByTokenRepository {
  loadByToken(accessToken: string, permission: number): Promise<User>
}
