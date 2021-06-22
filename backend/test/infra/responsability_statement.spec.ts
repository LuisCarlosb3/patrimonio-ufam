import { InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'
import { PatrimonyState } from '@/domain/model/patrimony'
import MockDate from 'mockdate'
import knex from '@/infra/db/helper/index'
const makeFakeInsertNewStatementModel = (): InsertNewStatementModel => ({
  responsibleName: 'any_name',
  code: 'any_code',
  siapeCode: 'any_code',
  emissionDate: new Date(),
  patrimoniesIds: []
})
async function insertPatrimony (code?: String): Promise<string> {
  const patrimony = {
    code: code || 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entry_date: new Date('1/1/2021'),
    last_conference_date: new Date('1/1/2021'),
    value: 200
  }
  const [id] = await knex('patrimony').insert(patrimony).returning('id')
  return id
}
async function insertSatement (patrimonyIds: string[], code?: string): Promise<string> {
  const [newId] = await knex('responsability_statement').insert({
    responsible_name: 'any_name',
    siape: 'any_code',
    code: code || 'any_code',
    emission_date: new Date()
  }).returning('id')
  for await (const id of patrimonyIds) {
    const item = {
      patrimony_id: id,
      statement_id: newId
    }
    await knex('responsability_statement_itens').insert(item)
  }
  return newId
}
const makeSut = (): ResponsabilityStatementRespositoy => {
  return new ResponsabilityStatementRespositoy()
}

describe('ResponsabilityStatementRespositoy', () => {
  beforeAll(async done => {
    await knex.migrate.latest()
    MockDate.set(new Date())
    done()
  })
  beforeEach(async () => {
    await knex('responsability_statement_itens').del()
    await knex('responsability_statement').del()
    await knex('patrimony').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    MockDate.reset()
    done()
  })
  describe('create', () => {
    test('Ensure create method insert new responsability statement', async () => {
      const sut = makeSut()
      const newStatement = makeFakeInsertNewStatementModel()
      const patrimonyId = await insertPatrimony()
      newStatement.patrimoniesIds.push(patrimonyId)
      await sut.create(newStatement)
      const [statement] = await knex('responsability_statement')
      const [item] = await knex('responsability_statement_itens')
      expect(item).toBeTruthy()
      expect(item.patrimony_id).toEqual(patrimonyId)
      expect(item.statement_id).toEqual(statement.id)
    })
    test('Ensure create method don\'t insert new responsability if patrimony already alocated to another one', async () => {
      const sut = makeSut()
      const newStatement = makeFakeInsertNewStatementModel()
      const patrimonyId = await insertPatrimony()
      await insertSatement([patrimonyId])
      newStatement.patrimoniesIds.push(patrimonyId)
      await sut.create(newStatement)
      const statement = await knex('responsability_statement')
      const itens = await knex('responsability_statement_itens')
      expect(itens.length).toBe(1)
      expect(statement.length).toBe(1)
    })
  })
  describe('loadByPatrimonyId', () => {
    test('ensure loadByPatrimonyId returns StatementItem on exists', async () => {
      const sut = makeSut()
      const patrimonyId = await insertPatrimony()
      const statementId = await insertSatement([patrimonyId])
      const item = await sut.loadByPatrimonyId(patrimonyId)
      expect(item.patrimonyId).toBe(patrimonyId)
      expect(item.id).toBe(statementId)
    })
    test('ensure loadByPatrimonyId returns null on StatementItem not exists', async () => {
      const sut = makeSut()
      const patrimonyId = await insertPatrimony()
      const item = await sut.loadByPatrimonyId(patrimonyId)
      expect(item).toBeNull()
    })
  })
  describe('verifyCode', () => {
    test('ensure verifyCode returns true if code exists', async () => {
      const sut = makeSut()
      const patrimonyId = await insertPatrimony()
      await insertSatement([patrimonyId])
      const item = await sut.verifyCode('any_code')
      expect(item).toBeTruthy()
    })
    test('ensure verifyCode returns false if code not exists', async () => {
      const sut = makeSut()
      const patrimonyId = await insertPatrimony()
      await insertSatement([patrimonyId])
      const item = await sut.verifyCode('any_other_code')
      expect(item).toBeFalsy()
    })
  })
  describe('load', () => {
    test('ensure DbLoadPatrimonyList load statements itens', async () => {
      const sut = makeSut()
      const patrimonyId = await insertPatrimony('1')
      const patrimonyId2 = await insertPatrimony('2')
      const id = await insertSatement([patrimonyId, patrimonyId2])
      const statements = await sut.load(0, 10)
      expect(statements.length).toBe(1)
      expect(statements[0].id).toEqual(id)
      expect(statements[0].responsibleName).toEqual('any_name')
    })
    test('ensure DbLoadPatrimonyList load statements itens paginated', async () => {
      const sut = makeSut()
      const ids = []
      for await (const i of Array(5).keys()) {
        const patrimonyId = await insertPatrimony(`${i}`)
        const id = await insertSatement([patrimonyId], `${i}`)
        ids.push(id)
      }
      const firstPage = await sut.load(0, 2)
      expect(firstPage.length).toBe(2)
      const secondPage = await sut.load(2, 2)
      expect(secondPage.length).toBe(2)
      expect(firstPage[0].id).toEqual(ids[0])
      expect(firstPage[1].id).toEqual(ids[1])
      expect(secondPage[0].id).toEqual(ids[2])
      expect(secondPage[1].id).toEqual(ids[3])
    })
  })
})
