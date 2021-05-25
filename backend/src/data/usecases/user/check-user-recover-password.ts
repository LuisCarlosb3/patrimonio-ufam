import { DbLoadUserByRecoverLink } from '@/data/protocols/db/check-user-recover-password/db-load-user-by-link'
import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'

export class CheckUserRecoverPassword implements CheckUserRecoverLink {
  constructor (private readonly dbLoadUser: DbLoadUserByRecoverLink) {}
  async verify (link: string): Promise<string> {
    await this.dbLoadUser.loadByLink(link)
    return null
  }
}
