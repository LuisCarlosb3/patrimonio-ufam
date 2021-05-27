import { DbLoadUserByRecoverLink } from '@/data/protocols/db/check-user-recover-password/db-load-user-by-link'
import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'

export class CheckUserRecoverPassword implements CheckUserRecoverLink {
  constructor (private readonly dbLoadUser: DbLoadUserByRecoverLink) {}
  async verify (link: string): Promise<string> {
    const userLink = await this.dbLoadUser.loadByLink(link)
    if (userLink) {
      if (userLink.expiresAt.getTime() > new Date().getTime()) {
        return userLink.userId
      }
    }
    return null
  }
}
