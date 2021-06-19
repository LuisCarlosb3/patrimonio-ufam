import { AuthenticationModel, UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/user/db-load-account-by-registration'
import { HashComparer } from '@/data/protocols/criptography/hash-compare'
import Encrypter from '@/data/protocols/criptography/encrypter'
import { User } from '@/domain/model/user'
import { DbCreateUserAccessToken } from '@/data/protocols/db/user/db-create-user-token'

export class AuthenticationData implements UserAuthentication {
  constructor (
    private readonly dbLoadAccountByRegistration: DbLoadAccountByRegistration,
    private readonly hashComparer: HashComparer,
    private readonly jwtGenerator: Encrypter,
    private readonly dbCreateUserAccessToken: DbCreateUserAccessToken
  ) {}

  async auth (auth: AuthenticationModel): Promise<{token: string, userData: Omit<User, 'id' | 'password'>}> {
    const userData = await this.dbLoadAccountByRegistration.loadByRegistration(auth.registration)
    if (userData) {
      const passwordMath = await this.hashComparer.compare(auth.password, userData.password)
      if (passwordMath) {
        const token = await this.jwtGenerator.encrypt({ id: userData.id, permission: userData.permission })
        const { id, password, ...userInfo } = userData
        await this.dbCreateUserAccessToken.createUserToken(id, token)
        return { token, userData: userInfo }
      }
    }
    return null
  }
}
