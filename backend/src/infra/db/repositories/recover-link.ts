import { DbUpdateUserRecoverLink } from '@/data/protocols/db/user-recover-password/db-update-user-recover-password'
import knex from '../helper/index'
export class RecoverLink implements DbUpdateUserRecoverLink {
  private readonly tableName = 'user-recover-link'
  async update (id: string, link: string): Promise<boolean> {
    const res = await knex(this.tableName).insert({
      user_id: id,
      link
    }).returning('id')
    return (res[0] !== null)
  }
}
