import Decrypter from '@/data/protocols/criptography/decrypter'
import { LoadUserByTokenRepository } from '@/data/protocols/db/user/db-load-user-by-token'
import { User, UserPermission } from '@/domain/model/user'
import { LoadUserByToken } from '@/domain/usecase/user/load-user-by-token'

export class LoadUserByTokenData implements LoadUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load (accessToken: string, permission?: UserPermission): Promise<User> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const userAccount = await this.loadUserByTokenRepository.loadByToken(accessToken, permission)
      if (userAccount) {
        return userAccount
      }
    }
    return null
  }
}
