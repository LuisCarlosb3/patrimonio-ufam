import { DbCreateNewUser, DbCreateNewUserModel } from '@/data/protocols/db/user/db-create-new-user'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/user/db-load-account-by-registration'
import { DbLoadUserByEmailAndRegistration } from '@/data/protocols/db/user/db-load-user-by-email-and-registration'
import { DbLoadUserById } from '@/data/protocols/db/user/db-load-user-by-id'
import { DbUpdateUserPasswordById } from '@/data/protocols/db/user/db-update-user-password-by-id'
import { User } from '@/domain/model/user'
import knex from '../helper/index'

export class UserRepository implements DbLoadAccountByRegistration, DbUpdateUserPasswordById, DbLoadUserByEmailAndRegistration, DbCreateNewUser, DbLoadUserById {
  private readonly tableName = 'users'
  async loadByRegistration (registration: string): Promise<User> {
    const data = await knex<User>(this.tableName).where({ registration })
    return data[0] ?? null
  }

  async updateById (userId: string, newPassword: string): Promise<void> {
    await knex<User>(this.tableName).update({
      password: newPassword
    }).where({ id: userId })
  }

  async loadByEmailAndRegistration (email: string, registration: string): Promise<User> {
    const data = await knex<User>(this.tableName).where({ registration }).orWhere({ email })
    return data[0] ?? null
  }

  async create (newUser: DbCreateNewUserModel): Promise<User> {
    const { name, registration, email, password, permission } = newUser
    const [createdUser] = await knex<User>(this.tableName).insert({
      name, registration, email, password, permission
    }).returning('*')
    return createdUser
  }

  async loadById (id: string): Promise<User> {
    const data = await knex<User>(this.tableName).where({ id })
    return data[0] ?? null
  }
}
