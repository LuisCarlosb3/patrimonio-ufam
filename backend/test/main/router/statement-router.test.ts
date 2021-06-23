import request from 'supertest'
import server from '@/main/config/app'
import knex from '@/infra/db/helper/index'

import { generateUserAndToken } from './util/user-payload'
import { CreateStatementModel } from '@/domain/usecase/responsability-statement/create-responsability-statement'

async function insertNewPatrimony (code?: String, statementId?: string): Promise<string> {
  const patrimony = {
    code: code || 'any_code',
    description: 'any_description',
    state: 'NOVO',
    entry_date: new Date('1/1/2021'),
    last_conference_date: new Date('1/1/2021'),
    value: 200,
    statement_id: statementId
  }
  const [id] = await knex('patrimony').insert(patrimony).returning('id')
  return id
}
async function insertStatement (code?: string): Promise<string> {
  const [newId] = await knex('responsability_statement').insert({
    responsible_name: 'any_name',
    siape: 'any_code',
    code: code || 'any_code',
    emission_date: new Date()
  }).returning('id')
  return newId
}
const insertStatementList = async (quantity: number): Promise<void> => {
  for await (const i of Array(quantity).keys()) {
    const id = await insertStatement(`${i}`)
    await insertNewPatrimony(`${i}`, id)
  }
}
const makeStatementPayload = (patrimonyCode: string): CreateStatementModel => ({
  responsibleName: 'any name',
  siapeCode: 'siape code',
  emissionDate: new Date(),
  patrimoniesCode: [patrimonyCode]
})

describe('Statement Routes', () => {
  beforeAll(async done => {
    await knex.migrate.down()
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('patrimony').del()
    await knex('responsability_statement').del()
    await knex('user-access-token').del()
    await knex('new-user-link').del()
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  describe('/statement/create', () => {
    test('ensure statement create return 204 on create new responsability statement', async () => {
      const accessToken = await generateUserAndToken()
      const patrimonyId = await insertNewPatrimony('my_code')
      const payload = makeStatementPayload('my_code')
      await request(server).post('/statement/create')
        .set('x-access-token', accessToken)
        .send({ newStatement: payload }).expect(204)
      const [data] = await knex('responsability_statement')
      const [patrimony] = await knex('patrimony')
      expect(data.siape).toEqual(payload.siapeCode)
      expect(data.responsible_name).toEqual(payload.responsibleName)
      expect(patrimony.id).toBe(patrimonyId)
      expect(patrimony.statement_id).toBe(data.id)
    })
    test('ensure statement create return 400 on invalid body request (code)', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makeStatementPayload('my_code')
      delete payload.responsibleName
      await request(server).post('/statement/create')
        .set('x-access-token', accessToken)
        .send({ newStatement: payload }).expect(400, { error: 'Invalid param: newStatement.responsibleName' })
    })
    test('ensure patrimony create return 400 on code not found', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makeStatementPayload('my_code')
      await request(server).post('/statement/create')
        .set('x-access-token', accessToken)
        .send({ newStatement: payload }).expect(400, { error: 'Patrimony not found: my_code' })
    })
    test('ensure patrimony create return 400 on patrimony already registered to statement', async () => {
      const accessToken = await generateUserAndToken()
      const payload = makeStatementPayload('my_code')
      const id = await insertStatement()
      await insertNewPatrimony('my_code', id)
      await request(server).post('/statement/create')
        .set('x-access-token', accessToken)
        .send({ newStatement: payload }).expect(400, { error: 'Patrimony my_code already has statement' })
    })
  })
  describe('/statement-list/:page?', () => {
    test('ensure statement list return 200 with responsability statements list', async () => {
      const accessToken = await generateUserAndToken()
      await insertStatementList(20)
      let response = await request(server).get('/statement-list').set('x-access-token', accessToken).expect(200)
      let { statementList } = response.body
      expect(statementList.length).toEqual(10)
      expect(statementList[0].code).toEqual('0')
      expect(statementList[0].patrimonies).toEqual(expect.any(Array))
      expect(statementList[0].patrimonies[0].code).toEqual('0')
      response = await request(server).get('/statement-list/2').set('x-access-token', accessToken).expect(200)
      statementList = response.body.statementList
      expect(statementList.length).toEqual(10)
      expect(statementList[0].code).toEqual('10')
    })
    test('ensure patrimony list return 200 with first page of patrimony list on page is lower than 1', async () => {
      const accessToken = await generateUserAndToken()
      await insertStatementList(20)
      const response = await request(server).get('/statement-list/-1').set('x-access-token', accessToken).expect(200)
      const { statementList } = response.body
      expect(statementList.length).toEqual(10)
      expect(statementList[0].code).toEqual('0')
    })
  })
})
