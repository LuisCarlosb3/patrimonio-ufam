import { User, UserPermission } from '@/domain/model/user'
import knex from '@/infra/db/helper/index'
import { RecoverLink } from '@/infra/db/repositories/recover-link'
const makeUser = (): Omit<User, 'id'> => {
  return {
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'any_hash',
    permission: UserPermission.INVENTORIOUS
  }
}
const insertPayload = async (): Promise<string> => {
  const user = makeUser()
  const userId = await knex('users').insert(user).returning('id')
  return userId[0]
}
describe('User Postgres Repository', () => {
  beforeAll(async done => {
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('user-recover-link').del()
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  const makeSut = (): RecoverLink => {
    return new RecoverLink()
  }
  test('Ensure RecoverLink create user recover link', async () => {
    const sut = makeSut()
    const userId = await insertPayload()
    const res = await sut.update(userId, 'any_hash')
    expect(res).toBeTruthy()
    const link = await knex('user-recover-link').where({ link: 'any_hash' })
    expect(link[0]).toBeTruthy()
    expect(link[0].user_id).toEqual(userId)
  })
})
