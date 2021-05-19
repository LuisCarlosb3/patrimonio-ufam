import request from 'supertest'
import server from '@/main/config/app'
import bcrypt from 'bcrypt'
import knex from '@/infra/db/helper/index'
import { User, UserPermission } from '@/domain/model/user'
const makeUser = (): Omit<User, 'id' | 'password'> => {
  return {
    name: 'any_name',
    registration: 'myregistration',
    email: 'any@email.com',
    permission: UserPermission.INVENTORIOUS
  }
}
const insertPayload = async (): Promise<void> => {
  const password = await bcrypt.hash('123456', 12)
  const user = makeUser()
  await knex('users').insert({ ...user, password })
}
describe('Authentication Routes', () => {
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
  test('Should return 200 on login', async () => {
    await insertPayload()
    await request(server).post('/login').send({
      registration: 'myregistration',
      password: '123456'
    }).expect(200)
  })
})
