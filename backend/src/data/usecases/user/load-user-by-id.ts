import { DbLoadUserById } from '@/data/protocols/db/user/db-load-user-by-id'
import { User } from '@/domain/model/user'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'

export class LoadUserByIdData implements LoadUserById {
  constructor (
    private readonly loadUserById: DbLoadUserById
  ) {}

  async load (id: string): Promise<User> {
    const userAccount = await this.loadUserById.loadById(id)
    return userAccount
  }
}
