import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { DbUpdateUserRecoverLink } from '@/data/protocols/db/user-recover-password/db-update-user-recover-password'
import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'

export class RecoverPasswordData implements UserRecoverPassword {
  constructor (
    private readonly dbLoadAccountByRegistration: DbLoadAccountByRegistration,
    private readonly hasher: Hasher,
    private readonly dbUpdateUserRegistration: DbUpdateUserRecoverLink
  ) {}

  async recover (registration: string): Promise<{email: string, hashlink: string}> {
    const user = await this.dbLoadAccountByRegistration.loadByRegistration(registration)
    if (user) {
      const hashlink = await this.hasher.hash(registration)
      await this.dbUpdateUserRegistration.update(user.id, hashlink)
      return { email: user.email, hashlink }
    }
    return null
  }
}
