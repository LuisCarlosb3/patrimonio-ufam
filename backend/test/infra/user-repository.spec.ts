import { User, UserPermission } from '@/domain/model/user'
import knex from '@/infra/db/helper/index'
import { UserRepository } from '@/infra/db/repositories/user-repository'
const makeUser = (): User => {
  return {
    id: 'any_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'any_hash',
    permission: UserPermission.INVENTORIOUS
  }
}
const insertPayload = async (): Promise<void> => {
  const { id, ...user } = makeUser()
  await knex('users').insert(user)
}
describe('User Postgres Repository', () => {
  beforeAll(async done => {
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  const makeSut = (): UserRepository => {
    return new UserRepository()
  }
  test('Ensure UserRepository loads user by registration on success', async () => {
    const sut = makeSut()
    await insertPayload()
    const res = await sut.loadByRegistration('any_registration')
    expect(res).toBeTruthy()
    expect(res.email).toEqual('any@email.com')
  })
  test('Ensure UserRepository return null if user not exists', async () => {
    const sut = makeSut()
    const res = await sut.loadByRegistration('any_registration')
    expect(res).toBeNull()
  })
})
