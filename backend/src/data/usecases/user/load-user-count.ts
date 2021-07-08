import { DbLoadUserCount } from '@/data/protocols/db/user/db-load-user-count'
import { LoadUserCount } from '@/domain/usecase/user/load-user-count'

export class LoadUserCountData implements LoadUserCount {
  constructor (
    private readonly dbCountUser: DbLoadUserCount
  ) {}

  async count (): Promise<number> {
    const total = await this.dbCountUser.count()
    return total
  }
}
