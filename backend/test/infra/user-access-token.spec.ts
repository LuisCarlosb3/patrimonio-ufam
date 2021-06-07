import { User, UserPermission } from '@/domain/model/user'
import knex from '@/infra/db/helper/index'
import { UserAccessTokenRepository } from '@/infra/db/repositories/user-access-token'
const makeUser = (): Omit<User, 'id'> => {
  return {
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'any_hash',
    permission: UserPermission.INVENTORIOUS
  }
}
const insertUser = async (): Promise<string> => {
  const user = makeUser()
  const userId = await knex('users').insert(user).returning('id')
  return userId[0]
}
const insertToken = async (userId: string): Promise<void> => {
  await knex('user-access-token').insert({
    user_id: userId,
    token: 'user_token'
  })
}
describe('UserAccessTokenRepository', () => {
  beforeAll(async done => {
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('user-access-token').del()
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  const makeSut = (): UserAccessTokenRepository => {
    return new UserAccessTokenRepository()
  }
  test('Ensure NewUserLinkRepository loadUser data success', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    await insertToken(userId)
    const userAccount = await sut.loadByToken('user_token', UserPermission.INVENTORIOUS)
    expect(userAccount.id).toEqual(userId)
    expect(userAccount.name).toEqual('any_name')
  })
  test('Ensure NewUserLinkRepository dont loadUser if user dont have permission', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    await insertToken(userId)
    const userAccount = await sut.loadByToken('user_token', UserPermission.ADMINISTRATOR)
    expect(userAccount).toBeNull()
  })
  test('Ensure NewUserLinkRepository returns null on token with permission not found', async () => {
    const sut = makeSut()
    await insertUser()
    const userData = await sut.loadByToken('user_token', UserPermission.INVENTORIOUS)
    expect(userData).toBeNull()
  })
})
