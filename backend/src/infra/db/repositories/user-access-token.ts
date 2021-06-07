import { LoadUserByTokenRepository } from '@/data/protocols/db/user/db-load-user-by-token'
import { User } from '@/domain/model/user'
import knex from '../helper/index'

export class UserAccessTokenRepository implements LoadUserByTokenRepository {
  private readonly tableName = 'user-access-token'
  async loadByToken (token: string, permission: number): Promise<User> {
    const queryResponse = await knex({ tokens: this.tableName })
      .select('tokens.*', 'tokens.id as tokens.token_id', 'user.*')
      .where({ token })
      .where('user.permission', permission)
      .innerJoin({ user: 'users' }, 'tokens.user_id', 'user.id')
    if (queryResponse.length > 0) {
      const [payload] = queryResponse
      const { user_id: id, name, registration, email, password, permission } = payload
      const userData = { id, name, registration, email, password, permission }
      return userData
    }
    return null
  }
}
