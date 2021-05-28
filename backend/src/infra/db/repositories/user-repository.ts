import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { DbUpdateUserPasswordById } from '@/data/protocols/db/db-update-user-password-by-id'
import { User } from '@/domain/model/user'
import knex from '../helper/index'

export class UserRepository implements DbLoadAccountByRegistration, DbUpdateUserPasswordById {
  private readonly tableName = 'users'
  async loadByRegistration (registration: string): Promise<User> {
    const data = await knex(this.tableName).where({ registration })
    return data[0] ?? null
  }

  async updateById (userId: string, newPassword: string): Promise<void> {
    await knex(this.tableName).update({
      password: newPassword
    }).where({ id: userId })
  }
}
