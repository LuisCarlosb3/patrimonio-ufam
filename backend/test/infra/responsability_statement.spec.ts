import { InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'
import { PatrimonyState } from '@/domain/model/patrimony'
import MockDate from 'mockdate'
import knex from '@/infra/db/helper/index'
const makeFakeInsertNewStatementModel = (): InsertNewStatementModel => ({
  responsibleName: 'any_name',
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
async function insertSatement (patrimonyId: string): Promise<void> {
  const [newId] = await knex('responsability_statement').insert({
    responsible_name: 'any_name',
    siape: 'any_code',
    emission_date: new Date()
  }).returning('id')
  const item = {
    patrimony_id: patrimonyId,
    statement_id: newId
  }
  await knex('responsability_statement_itens').insert(item)
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
      await insertSatement(patrimonyId)
      newStatement.patrimoniesIds.push(patrimonyId)
      await sut.create(newStatement)
      const statement = await knex('responsability_statement')
      const itens = await knex('responsability_statement_itens')
      expect(itens.length).toBe(1)
      expect(statement.length).toBe(1)
    })
  })
})
