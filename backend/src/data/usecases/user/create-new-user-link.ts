import { DbCreateFirsAccessLink } from '@/data/protocols/db/db-update-user-with-first-access-link'
import { CreateNewUserLink } from '@/domain/usecase/user/create-user-by-admin'
import { randomBytes } from 'crypto'
export class CreateNewUserLinkData implements CreateNewUserLink {
  constructor (
    private readonly dbCreateFirsAccessLink: DbCreateFirsAccessLink
  ) {}

  async create (userId: string): Promise<string> {
    const hashlink = randomBytes(36).toString('hex')
    await this.dbCreateFirsAccessLink.createLink(userId, hashlink)
    return hashlink
  }
}
