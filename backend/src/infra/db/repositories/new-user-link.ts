import { DbCreateFirsAccessLink } from '@/data/protocols/db/user/db-update-user-with-first-access-link'
import knex from '@/infra/db/helper/index'

export class NewUserLinkRepository implements DbCreateFirsAccessLink {
  private readonly tableName = 'new-user-link'
  async createLink (userId: string, accessLink: string): Promise<void> {
    await knex(this.tableName).insert({
      user_id: userId,
      link: accessLink
    })
  }
}
