import Env from '@/main/config/env'
import knex from '@/infra/db/helper/index'
import { User, UserPermission } from '@/domain/model/user'
import { sign } from 'jsonwebtoken'

export const makeUser = (isAdmin = true): Omit<User, 'id' | 'password'> => {
  const perm = isAdmin ? UserPermission.ADMINISTRATOR : UserPermission.INVENTORIOUS
  return {
    name: 'any_name',
    registration: 'myregistration',
    email: 'any@email.com',
    permission: perm
  }
}
export const insertPayload = async (isAdmin = true): Promise<string> => {
  const password = '123456'
  const user = makeUser(isAdmin)
  const userId = await knex('users').insert({ ...user, password }).returning('id')
  return userId[0]
}
export const generateUserAndToken = async (isAdmin = true): Promise<string> => {
  const id = await insertPayload(isAdmin)
  const permission = isAdmin ? UserPermission.ADMINISTRATOR : UserPermission.INVENTORIOUS
  const accessToken = sign({ id, permission }, Env.jwtSecret)
  await knex('user-access-token').insert({
    user_id: id,
    token: accessToken
  })
  return accessToken
}
