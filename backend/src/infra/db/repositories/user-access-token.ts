import { DbCreateUserAccessToken } from '@/data/protocols/db/user/db-create-user-token'
import { LoadUserByTokenRepository } from '@/data/protocols/db/user/db-load-user-by-token'
import { User } from '@/domain/model/user'
import knex from '../helper/index'

export class UserAccessTokenRepository implements LoadUserByTokenRepository, DbCreateUserAccessToken {
  private readonly tableName = 'user-access-token'
  async loadByToken (token: string, permission?: number): Promise<User> {
    let queryResponse = null
    const query = knex({ tokens: this.tableName })
      .select('tokens.*', 'tokens.id as tokens.token_id', 'user.*')
      .where({ token })
    if (permission) {
      queryResponse = await query.where('user.permission', permission).innerJoin({ user: 'users' }, 'tokens.user_id', 'user.id')
    } else {
      queryResponse = await query.innerJoin({ user: 'users' }, 'tokens.user_id', 'user.id')
    }
    if (queryResponse.length > 0) {
      const [payload] = queryResponse
      const { user_id: id, name, registration, email, password, permission } = payload
      const userData = { id, name, registration, email, password, permission }
      return userData
    }
    return null
  }

  async createUserToken (userId: string, token: string): Promise<void> {
    await knex(this.tableName).insert({
      user_id: userId,
      token
    })
  }
}
