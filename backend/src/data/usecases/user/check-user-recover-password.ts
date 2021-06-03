import { DbDeleteUserByRecoverByID } from '@/data/protocols/db/user/check-user-recover-password/db-delete-user-link'
import { DbLoadUserByRecoverLink } from '@/data/protocols/db/user/check-user-recover-password/db-load-user-by-link'
import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'

export class CheckUserRecoverPassword implements CheckUserRecoverLink {
  constructor (
    private readonly dbLoadUser: DbLoadUserByRecoverLink,
    private readonly dbDeleteLinkById: DbDeleteUserByRecoverByID
  ) {}

  async verify (link: string): Promise<string> {
    const userLink = await this.dbLoadUser.loadByLink(link)
    if (userLink) {
      if (userLink.expiresAt.getTime() > new Date().getTime()) {
        return userLink.userId
      } else {
        await this.dbDeleteLinkById.deleteById(userLink.id)
      }
    }
    return null
  }
}
