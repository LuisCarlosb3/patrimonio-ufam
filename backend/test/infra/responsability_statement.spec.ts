import { InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'
import { PatrimonyState } from '@/domain/model/patrimony'
import MockDate from 'mockdate'
import knex from '@/infra/db/helper/index'
import { DbUpdateStatementByIdModel } from '@/data/protocols/db/responsability-statement/db-update-statement-by-id'
const makeFakeInsertNewStatementModel = (): InsertNewStatementModel => ({
  responsibleName: 'any_name',
  code: 'any_code',
  siapeCode: 'any_code',
  emissionDate: new Date(),
  patrimoniesIds: []
})
const makeFakeUpdateStatementModel = (id: string): DbUpdateStatementByIdModel => ({
  id: id,
  responsibleName: 'updated_name',
  siapeCode: 'updated_code',
  emissionDate: new Date('12/12/2021')
})
async function insertPatrimony (code?: String, statementId?: string): Promise<string> {
  const patrimony = {
    code: code || 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entry_date: new Date('1/1/2021'),
    last_conference_date: new Date('1/1/2021'),
    value: 200,
    statement_id: statementId
  }
  const [id] = await knex('patrimony').insert(patrimony).returning('id')
  return id
}
async function insertSatement (code?: string): Promise<string> {
  const [newId] = await knex('responsability_statement').insert({
    responsible_name: 'any_name',
    siape: 'any_code' + (code || ''),
    code: code || 'any_code',
    emission_date: new Date()
  }).returning('id')
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
    await knex('patrimony').del()
    await knex('responsability_statement').del()
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
      const [patrimony] = await knex('patrimony').where({ id: patrimonyId })
      expect(patrimony).toBeTruthy()
      expect(patrimony.statement_id).toEqual(statement.id)
    })
    test('Ensure create method don\'t insert new responsability if patrimony already alocated to another one', async () => {
      const sut = makeSut()
      const newStatement = makeFakeInsertNewStatementModel()
      const id = await insertSatement('any_statement')
      const patrimonyId = await insertPatrimony(undefined, id)
      newStatement.patrimoniesIds.push(patrimonyId)
      await sut.create(newStatement)
      const [statement] = await knex('responsability_statement')
      const [patrimony] = await knex('patrimony').where({ id: patrimonyId })
      expect(patrimony).toBeTruthy()
      expect(patrimony.statement_id).not.toEqual(statement.id)
    })
  })
  describe('loadByPatrimonyId', () => {
    test('ensure loadByPatrimonyId returns StatementItem on exists', async () => {
      const sut = makeSut()
      const statementId = await insertSatement()
      const patrimonyId = await insertPatrimony(undefined, statementId)
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
      await insertSatement()
      const item = await sut.verifyCode('any_code')
      expect(item).toBeTruthy()
    })
    test('ensure verifyCode returns false if code not exists', async () => {
      const sut = makeSut()
      await insertSatement()
      const item = await sut.verifyCode('any_other_code')
      expect(item).toBeFalsy()
    })
  })
  describe('load', () => {
    test('ensure DbLoadPatrimonyList load statements itens', async () => {
      const sut = makeSut()
      const id = await insertSatement()
      await insertPatrimony('1', id)
      await insertPatrimony('2', id)
      const statements = await sut.load(0, 10)
      expect(statements.length).toBe(1)
      expect(statements[0].id).toEqual(id)
      expect(statements[0].responsibleName).toEqual('any_name')
    })
    test('ensure DbLoadPatrimonyList load statements itens paginated', async () => {
      const sut = makeSut()
      const ids = []
      for await (const i of Array(5).keys()) {
        const id = await insertSatement(`${i}`)
        await insertPatrimony(`${i}`, id)
        ids.push(id)
      }
      const firstPage = await sut.load(0, 2)
      const secondPage = await sut.load(2, 2)
      const thirdPage = await sut.load(4, 2)
      expect(firstPage.length).toBe(2)
      expect(secondPage.length).toBe(2)
      expect(thirdPage.length).toBe(1)
      expect(firstPage[0].id).toEqual(ids[0])
      expect(firstPage[1].id).toEqual(ids[1])
      expect(secondPage[0].id).toEqual(ids[2])
      expect(secondPage[1].id).toEqual(ids[3])
    })
  })
  describe('loadByCodeOrSiape', () => {
    test('ensure DbLoadPatrimonyList load statements itens - check 1', async () => {
      const sut = makeSut()
      const id = await insertSatement('code_1')
      await insertPatrimony('1', id)
      const id2 = await insertSatement('code_2')
      await insertPatrimony('2', id2)
      const statements = await sut.loadByCodeOrSiape('1', 0, 10)
      expect(statements.length).toBe(1)
      expect(statements[0].id).toEqual(id)
      expect(statements[0].code).toEqual('code_1')
    })
    test('ensure DbLoadPatrimonyList load statements itens -check 2', async () => {
      const sut = makeSut()
      const id = await insertSatement('code_1')
      await insertPatrimony('1', id)
      const id2 = await insertSatement('code_2')
      await insertPatrimony('2', id2)
      const statements = await sut.loadByCodeOrSiape('2', 0, 10)
      expect(statements.length).toBe(1)
      expect(statements[0].id).toEqual(id2)
      expect(statements[0].code).toEqual('code_2')
    })
    test('ensure DbLoadPatrimonyList load statements itens -check code', async () => {
      const sut = makeSut()
      const id = await insertSatement('code_1')
      await insertPatrimony('1', id)
      const id2 = await insertSatement('code_2')
      await insertPatrimony('2', id2)
      const statements = await sut.loadByCodeOrSiape('code', 0, 10)
      expect(statements.length).toBe(2)
      expect(statements[0].id).toEqual(id)
      expect(statements[1].id).toEqual(id2)
    })
  })
  describe('loadById', () => {
    test('ensure DbLoadPatrimonyList load statement by id', async () => {
      const sut = makeSut()
      const id = await insertSatement('code_1')
      const statements = await sut.loadById(id)
      expect(statements.id).toEqual(id)
    })
    test('ensure DbLoadPatrimonyList load statements by id returns null if no exists', async () => {
      const sut = makeSut()
      const statements = await sut.loadById('5dddf67a-5947-4fad-9ec0-8d6569e06aea')
      expect(statements).toBeNull()
    })
  })
  describe('updateById', () => {
    test('Ensure update method change responsability statement data', async () => {
      const sut = makeSut()
      const id = await insertSatement('')
      const statementToUpdate = makeFakeUpdateStatementModel(id)
      await sut.updateById(statementToUpdate)
      const [statement] = await knex('responsability_statement')
      expect(statement).toBeTruthy()
      expect(statement.siape).toEqual(statementToUpdate.siapeCode)
      expect(statement.responsible_name).toEqual(statementToUpdate.responsibleName)
    })
  })
})
