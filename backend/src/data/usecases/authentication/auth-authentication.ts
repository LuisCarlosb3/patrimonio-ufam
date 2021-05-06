import { AuthenticationModel, UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { User } from '@/domain/model/user'

export class DbAuthentication implements UserAuthentication {
  constructor (
    private readonly dbLoadAccountByRegistration: DbLoadAccountByRegistration
  ) {}

  async auth (auth: AuthenticationModel): Promise<{ token: string, userAccount: Omit<User, 'id' | 'password'> }> {
    await this.dbLoadAccountByRegistration.loadByRegistration(auth.registration)
    return null
  }
}
