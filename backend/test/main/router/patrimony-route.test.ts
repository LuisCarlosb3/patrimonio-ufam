import request from 'supertest'
import server from '@/main/config/app'
import Env from '@/main/config/env'
import knex from '@/infra/db/helper/index'
import { User, UserPermission } from '@/domain/model/user'
import { sign } from 'jsonwebtoken'
const makeUser = (isAdmin = true): Omit<User, 'id' | 'password'> => {
  const perm = isAdmin ? UserPermission.ADMINISTRATOR : UserPermission.INVENTORIOUS
  return {
    name: 'any_name',
    registration: 'myregistration',
    email: 'any@email.com',
    permission: perm
  }
}
const insertPayload = async (isAdmin = true): Promise<string> => {
  const password = '123456'
  const user = makeUser(isAdmin)
  const userId = await knex('users').insert({ ...user, password }).returning('id')
  return userId[0]
}
const generateUserAndToken = async (isAdmin = true): Promise<string> => {
  const id = await insertPayload(isAdmin)
  const permission = isAdmin ? UserPermission.ADMINISTRATOR : UserPermission.INVENTORIOUS
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
const makePatrimonyPayloadToUpdate = (id: string): any => ({
  id,
  code: 'updated_code',
  description: 'updated_desc',
  state: 'NOVO',
  entryDate: new Date(),
  lastConferenceDate: new Date(),
  value: 50,
  patrimonyItens: [{ name: 'new_item', localization: 'new_localization' }],
  deletedItens: []
})
const insertNewPatrimony = async (code?: string): Promise<string> => {
  const patrimony = {
    code: code || 'any_code',
    description: 'any_desc',
    state: 'NOVO',
    entry_date: new Date(),
    last_conference_date: new Date(),
    value: 500.99
  }
  const [id] = await knex('patrimony').insert(patrimony).returning('id')
  return id
}
const insertPatrimonyList = async (quantity: number): Promise<void> => {
  for await (const i of Array(quantity).keys()) {
    await insertNewPatrimony(`${i}`)
  }
}

async function insertItens (id: string): Promise<string> {
  const item = { patrimony_id: id, name: 'item1', localization: 'any_localization' }
  const [itemid] = await knex('patrimony-itens').insert(item).returning('id')
  return itemid
}
describe('Patrimony Routes', () => {
  beforeAll(async done => {
    await knex.migrate.down()
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('patrimony-itens').del()
    await knex('patrimony').del()
    // await knex('user-recover-link').del()
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
  describe('/patrimony-list/:page', () => {
    test('ensure patrimony list return 200 with patrimony list', async () => {
      const accessToken = await generateUserAndToken()
      await insertPatrimonyList(20)
      let response = await request(server).get('/patrimony-list').set('x-access-token', accessToken).expect(200)
      let { patrimonyList } = response.body
      expect(patrimonyList.length).toEqual(10)
      expect(patrimonyList[0].code).toEqual('0')
      response = await request(server).get('/patrimony-list/2').set('x-access-token', accessToken).expect(200)
      patrimonyList = response.body.patrimonyList
      expect(patrimonyList.length).toEqual(10)
      expect(patrimonyList[0].code).toEqual('10')
    })
    test('ensure patrimony list return 200 with first page of patrimony list on page is lower than 1', async () => {
      const accessToken = await generateUserAndToken()
      await insertPatrimonyList(20)
      const response = await request(server).get('/patrimony-list/-1').set('x-access-token', accessToken).expect(200)
      const { patrimonyList } = response.body
      expect(patrimonyList.length).toEqual(10)
      expect(patrimonyList[0].code).toEqual('0')
    })
  })
  describe('/patrimony/:code', () => {
    test('ensure patrimony list return 200 with patrimony list', async () => {
      const accessToken = await generateUserAndToken()
      const id = await insertNewPatrimony('1234')
      const response = await request(server).get('/patrimony/1234').set('x-access-token', accessToken).expect(200)
      const { patrimony } = response.body
      expect(patrimony.id).toEqual(id)
      expect(patrimony.code).toEqual('1234')
    })
    test('ensure patrimony list return 404 with patrimony not found', async () => {
      const accessToken = await generateUserAndToken()
      await request(server).get('/patrimony/1234').set('x-access-token', accessToken).expect(404)
    })
  })
  describe('DELETE /patrimony', () => {
    test('ensure patrimony delete return 204 patrimony deleted', async () => {
      const accessToken = await generateUserAndToken()
      const id = await insertNewPatrimony('1234')
      await insertItens(id)
      await request(server).delete(`/patrimony/${id}`).set('x-access-token', accessToken).expect(204)
      const patrimony = await knex('patrimony').where({ id })
      const patrimonyItens = await knex('patrimony-itens').where({ patrimony_id: id })
      expect(patrimony.length).toBe(0)
      expect(patrimonyItens.length).toBe(0)
    })
    test('ensure patrimony list return 404 with patrimony not found', async () => {
      const accessToken = await generateUserAndToken()
      await request(server).delete('/patrimony/7e2b6994-840d-42f5-b730-33bb5d10a68e').set('x-access-token', accessToken).expect(404)
    })
    test('ensure patrimony list return 403 on user dont have permission', async () => {
      const accessToken = await generateUserAndToken(false)
      await request(server).delete('/patrimony/1234').set('x-access-token', accessToken).expect(403)
    })
  })
  describe('/patrimony/update', () => {
    test('ensure patrimony create return 204 on update a patrimony info', async () => {
      const accessToken = await generateUserAndToken()
      const patrimonyId = await insertNewPatrimony()
      const payload = makePatrimonyPayloadToUpdate(patrimonyId)
      await request(server).post('/patrimony/update')
        .set('x-access-token', accessToken)
        .send({ patrimony: payload }).expect(204)
      const [patrimony] = await knex('patrimony').where({ id: patrimonyId })
      expect(patrimony.code).toEqual(payload.code)
      expect(patrimony.value).toEqual(payload.value)
      expect(patrimony.id).toEqual(patrimonyId)
    })

    test('ensure patrimony create return 204 and deletes old itens and create new itens', async () => {
      const accessToken = await generateUserAndToken()
      const patrimonyId = await insertNewPatrimony()
      const item1Id = await insertItens(patrimonyId)
      const payload = makePatrimonyPayloadToUpdate(patrimonyId)
      payload.deletedItens.push(item1Id)
      await request(server).post('/patrimony/update')
        .set('x-access-token', accessToken)
        .send({ patrimony: payload }).expect(204)
      const itens = await knex('patrimony-itens').where({ patrimony_id: patrimonyId })
      expect(itens.length).toBe(1)
      expect(itens[0].id).not.toEqual(item1Id)
      expect(itens[0].name).toEqual('new_item')
    })
    test('ensure patrimony create return 400 on validation fail', async () => {
      const accessToken = await generateUserAndToken()
      const patrimonyId = await insertNewPatrimony()
      const { code, ...payload } = makePatrimonyPayloadToUpdate(patrimonyId)
      await request(server).post('/patrimony/update')
        .set('x-access-token', accessToken)
        .send({ patrimony: payload }).expect(400, { error: 'Invalid param: patrimony.code' })
    })
    test('ensure patrimony create return 400 on validation rejects value of deletedItens', async () => {
      const accessToken = await generateUserAndToken()
      const patrimonyId = await insertNewPatrimony()
      const payload = makePatrimonyPayloadToUpdate(patrimonyId)
      payload.deletedItens = 'anyothervalue'
      await request(server).post('/patrimony/update')
        .set('x-access-token', accessToken)
        .send({ patrimony: payload }).expect(400, { error: 'Invalid param: patrimony.deletedItens' })
    })
    test('ensure patrimony create return 400 on validation fail', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makePatrimonyPayloadToUpdate('7e2b6994-840d-42f5-b730-33bb5d10a68e')
      await request(server).post('/patrimony/update')
        .set('x-access-token', accessToken)
        .send({ patrimony: payload }).expect(400, { error: 'Patrimony not found' })
    })
  })
})
