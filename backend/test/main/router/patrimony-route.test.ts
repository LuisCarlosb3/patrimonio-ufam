import request from 'supertest'
import server from '@/main/config/app'
import Env from '@/main/config/env'
import knex from '@/infra/db/helper/index'
import { User, UserPermission } from '@/domain/model/user'
import { sign } from 'jsonwebtoken'
const makeUser = (): Omit<User, 'id' | 'password'> => {
  const perm = UserPermission.ADMINISTRATOR
  return {
    name: 'any_name',
    registration: 'myregistration',
    email: 'any@email.com',
    permission: perm
  }
}
const insertPayload = async (): Promise<string> => {
  const password = '123456'
  const user = makeUser()
  const userId = await knex('users').insert({ ...user, password }).returning('id')
  return userId[0]
}
const generateUserAndToken = async (): Promise<string> => {
  const id = await insertPayload()
  const permission = UserPermission.ADMINISTRATOR
  const accessToken = sign({ id, permission }, Env.jwtSecret)
  await knex('user-access-token').insert({
    user_id: id,
    token: accessToken
  })
  return accessToken
}
const makePatrimonyPayload = (): any => ({
  code: 'any_code',
  description: 'any_desc',
  state: 'NOVO',
  entryDate: new Date(),
  lastConferenceDate: new Date(),
  value: 500.99,
  patrimonyItens: [
    { name: 'any_item', localization: 'any_localization' },
    { name: 'any_item2', localization: 'any_localization', observation: 'any_obs' }
  ]
})
const insertNewPatrimony = async (code?: string): Promise<void> => {
  const patrimony = {
    code: code || 'any_code',
    description: 'any_desc',
    state: 'NOVO',
    entry_date: new Date(),
    last_conference_date: new Date(),
    value: 500.99
  }
  await knex('patrimony').insert(patrimony)
}
const insertPatrimonyList = async (quantity: number): Promise<void> => {
  for await (const i of Array(quantity).keys()) {
    await insertNewPatrimony(`${i}`)
  }
}
describe('Authentication Routes', () => {
  beforeAll(async done => {
    await knex.migrate.down()
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('patrimony-itens').del()
    await knex('patrimony').del()
    await knex('user-access-token').del()
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  describe('/patrimony/create', () => {
    test('ensure patrimony create return 204 on create new patrimony', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makePatrimonyPayload()
      await request(server).post('/patrimony/create')
        .set('x-access-token', accessToken)
        .send(payload).expect(204)
      const [patrimony] = await knex('patrimony')
      const patrimonyItens = await knex('patrimony-itens')
      expect(patrimony.code).toEqual(payload.code)
      expect(patrimony.value).toEqual(payload.value)
      expect(patrimony.state).toEqual(payload.state)
      expect(patrimonyItens.length).toBe(2)
      expect(patrimonyItens[0].patrimony_id).toBe(patrimony.id)
    })
    test('ensure patrimony create return 400 on invalid body request (code)', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makePatrimonyPayload()
      delete payload.code
      await request(server).post('/patrimony/create')
        .set('x-access-token', accessToken)
        .send(payload).expect(400, { error: 'Invalid param: code' })
    })
    test('ensure patrimony create return 400 on invalid body request (state)', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makePatrimonyPayload()
      payload.state = 'WRONG'
      await request(server).post('/patrimony/create')
        .set('x-access-token', accessToken)
        .send(payload).expect(400, { error: 'Invalid param: state' })
    })
    test('ensure patrimony create return 400 on invalid body request (patrimonyItens)', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makePatrimonyPayload()
      delete payload.patrimonyItens
      await request(server).post('/patrimony/create')
        .set('x-access-token', accessToken)
        .send(payload).expect(400, { error: 'Invalid param: patrimonyItens' })
    })
    test('ensure patrimony create return 400 on code already registered', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makePatrimonyPayload()
      await insertNewPatrimony()
      await request(server).post('/patrimony/create')
        .set('x-access-token', accessToken)
        .send(payload).expect(400, { error: 'The received code is already in use' })
    })
  })
  describe('/patrimony/:page', () => {
    test('ensure patrimony create return 200 with patrimony list', async () => {
      const accessToken = await generateUserAndToken()
      await insertPatrimonyList(20)
      let response = await request(server).get('/patrimony').set('x-access-token', accessToken).expect(200)
      let { patrimonyList } = response.body
      expect(patrimonyList.length).toEqual(10)
      expect(patrimonyList[0].code).toEqual('0')
      response = await request(server).get('/patrimony/2').set('x-access-token', accessToken).expect(200)
      patrimonyList = response.body.patrimonyList
      expect(patrimonyList.length).toEqual(10)
      expect(patrimonyList[0].code).toEqual('10')
    })
  })
})
