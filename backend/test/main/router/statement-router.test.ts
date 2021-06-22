import request from 'supertest'
import server from '@/main/config/app'
import knex from '@/infra/db/helper/index'

import { generateUserAndToken } from './util/user-payload'
import { CreateStatementModel } from '@/domain/usecase/responsability-statement/create-responsability-statement'

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
const makeStatementPayload = (patrimonyCode: string): CreateStatementModel => ({
  responsibleName: 'any name',
  siapeCode: 'siape code',
  emissionDate: new Date(),
  patrimoniesCode: [patrimonyCode]
})
const insertStatement = async (patrimonyId: string): Promise<string> => {
  const [newId] = await knex('responsability_statement').insert({
    responsible_name: 'any_name',
    siape: 'any_code',
    code: 'any_code',
    emission_date: new Date()
  }).returning('id')
  const item = {
    patrimony_id: patrimonyId,
    statement_id: newId
  }
  await knex('responsability_statement_itens').insert(item)
  return newId
}

describe('Statement Routes', () => {
  beforeAll(async done => {
    await knex.migrate.down()
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('responsability_statement_itens').del()
    await knex('responsability_statement').del()
    await knex('patrimony').del()
    await knex('user-access-token').del()
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
      const [item] = await knex('responsability_statement_itens')
      expect(data.siape).toEqual(payload.siapeCode)
      expect(data.responsible_name).toEqual(payload.responsibleName)
      expect(item.patrimony_id).toBe(patrimonyId)
      expect(item.statement_id).toBe(data.id)
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
      const patrimonyId = await insertNewPatrimony('my_code')
      await insertStatement(patrimonyId)
      await request(server).post('/statement/create')
        .set('x-access-token', accessToken)
        .send({ newStatement: payload }).expect(400, { error: 'Patrimony my_code already has statement' })
    })
  })
})
