import { DbCreateNewUser, DbCreateNewUserModel } from '@/data/protocols/db/user/db-create-new-user'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/user/db-load-account-by-registration'
import { DbLoadUserByEmailAndRegistration } from '@/data/protocols/db/user/db-load-user-by-email-and-registration'
import { DbLoadUserById } from '@/data/protocols/db/user/db-load-user-by-id'
import { DbLoadUserList } from '@/data/protocols/db/user/db-load-user-list'
import { DbUpdateUserPasswordById } from '@/data/protocols/db/user/db-update-user-password-by-id'
import { DeleteUserById } from '@/domain/usecase/user/delete-user-by-id'
import { User } from '@/domain/model/user'
import knex from '../helper/index'
import { DbLoadUserCount } from '@/data/protocols/db/user/db-load-user-count'

export class UserRepository implements DbLoadAccountByRegistration, DbUpdateUserPasswordById, DbLoadUserByEmailAndRegistration,
  DbCreateNewUser, DbLoadUserById, DeleteUserById, DbLoadUserList, DbLoadUserCount {
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

  async deleteById (userId: string): Promise<void> {
    await knex(this.tableName).where({ id: userId }).del()
  }

  async load (page: number, quantityPeerPage: number): Promise<User[]> {
    const baseData = await knex(this.tableName).select('id', 'name', 'registration', 'email', 'permission').limit(quantityPeerPage).offset(page)
    return baseData
  }

  async count (): Promise<number> {
    const [data] = await knex(this.tableName).count('id')
    const count = data.count || '0'
    const total = parseFloat(count.toString())
    return total
  }
}
