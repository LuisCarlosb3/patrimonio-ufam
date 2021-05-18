import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { User } from '@/domain/model/user'
import knex from '../helper/index'

export class UserRepository implements DbLoadAccountByRegistration {
  private readonly tableName = 'users'
  async loadByRegistration (registration: string): Promise<User> {
    const data = await knex(this.tableName).where({ registration })
    return data[0] ?? null
  }
}
