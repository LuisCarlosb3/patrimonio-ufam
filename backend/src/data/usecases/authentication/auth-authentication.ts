import { AuthenticationModel, UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { HashComparer } from '@/data/protocols/criptography/hash-compare'
import Encrypter from '@/data/protocols/criptography/encrypter'

export class DbAuthentication implements UserAuthentication {
  constructor (
    private readonly dbLoadAccountByRegistration: DbLoadAccountByRegistration,
    private readonly hashComparer: HashComparer,
    private readonly jwtGenerator: Encrypter
  ) {}

  async auth (auth: AuthenticationModel): Promise<string> {
    const userData = await this.dbLoadAccountByRegistration.loadByRegistration(auth.registration)
    if (userData) {
      const passwordMath = await this.hashComparer.compare(auth.password, userData.password)
      if (passwordMath) {
        const token = await this.jwtGenerator.encrypt({ id: userData.id, permission: userData.permission })
        return token
      }
    }
    return null
  }
}
