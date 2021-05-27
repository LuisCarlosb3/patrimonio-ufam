import { DbDeleteUserByRecoverByID } from '@/data/protocols/db/check-user-recover-password/db-delete-user-link'
import { DbLoadUserByRecoverLink } from '@/data/protocols/db/check-user-recover-password/db-load-user-by-link'
import { DbUpdateUserRecoverLink } from '@/data/protocols/db/user-recover-password/db-update-user-recover-password'
import { UserRecover } from '@/domain/model/user'
import knex from '../helper/index'
export class RecoverLink implements DbUpdateUserRecoverLink, DbLoadUserByRecoverLink, DbDeleteUserByRecoverByID {
  private readonly tableName = 'user-recover-link'
  async update (id: string, link: string): Promise<boolean> {
    const res = await knex(this.tableName).insert({
      user_id: id,
      link
    }).returning('id')
    return (res[0] !== null)
  }

  async loadByLink (link: string): Promise<UserRecover> {
    const [recoverLinkData] = await knex(this.tableName).select({
      id: 'id',
      userId: 'user_id',
      link: 'link',
      expiresAt: 'expires_at'
    }).where({ link })
    return recoverLinkData || null
  }

  async deleteById (linkId: string): Promise<void> {
    await knex(this.tableName).delete().where({ id: linkId })
  }
}
