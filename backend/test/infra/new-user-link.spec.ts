import { User, UserPermission } from '@/domain/model/user'
import knex from '@/infra/db/helper/index'
import { NewUserLinkRepository } from '@/infra/db/repositories/new-user-link'
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
describe('NewUserLinkRepository', () => {
  beforeAll(async done => {
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('user-recover-link').del()
    await knex('new-user-link').del()
    await knex('user-access-token').del()
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  const makeSut = (): NewUserLinkRepository => {
    return new NewUserLinkRepository()
  }
  test('Ensure NewUserLinkRepository creates a link on success', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    await sut.createLink(userId, 'any_hash')
    const link = await knex('new-user-link').where({ link: 'any_hash' })
    expect(link[0]).toBeTruthy()
    expect(link[0].user_id).toEqual(userId)
  })
})
