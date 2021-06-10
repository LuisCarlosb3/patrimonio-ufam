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
const insertPayload = async (): Promise<string> => {
  const { id, ...user } = makeUser()
  const [userId] = await knex('users').insert(user).returning('id')
  return userId
}
describe('User Postgres Repository', () => {
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
  test('Ensure UserRepository update user password by id on success', async () => {
    const sut = makeSut()
    const userId = await insertPayload()
    await sut.updateById(userId, 'new_hash')
    const [userData] = await knex('users').where({ id: userId })
    expect(userData).toBeTruthy()
    expect(userData.password).toEqual('new_hash')
  })
  test('Ensure UserRepository loads user by registration or email on success', async () => {
    const sut = makeSut()
    await insertPayload()
    const res = await sut.loadByEmailAndRegistration('any@email.com', 'any_registration')
    expect(res).toBeTruthy()
    expect(res.email).toEqual('any@email.com')
    expect(res.registration).toEqual('any_registration')
  })
  test('Ensure UserRepository loads user by registration or email on success', async () => {
    const sut = makeSut()
    await insertPayload()
    const res = await sut.loadByEmailAndRegistration('any@email.com', 'other_registration')
    expect(res).toBeTruthy()
    expect(res.email).toEqual('any@email.com')
    expect(res.registration).toEqual('any_registration')
  })
  test('Ensure UserRepository create new user returns an user on success', async () => {
    const sut = makeSut()
    const { id, ...user } = makeUser()
    const res = await sut.create(user)
    const [createdUser] = await knex('users').select()
    expect(res).toBeTruthy()
    expect(res.id).toBeTruthy()
    expect(createdUser.id).toEqual(res.id)
  })
})
