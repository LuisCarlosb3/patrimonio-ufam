import { DbLoadUserList } from '@/data/protocols/db/user/db-load-user-list'
import { LoadUserList } from '@/domain/usecase/user/list-user'
import { User } from '@/domain/model/user'

export class LoadUsersListData implements LoadUserList {
  constructor (
    private readonly loadUsers: DbLoadUserList
  ) {}

  async load (page?: number): Promise<User[]> {
    const quantityPeerPage = 10
    const pageToQuery = (page && page > 0) ? ((page - 1) * quantityPeerPage) : 0
    const usersList = await this.loadUsers.load(pageToQuery, quantityPeerPage)
    return usersList
  }
}
