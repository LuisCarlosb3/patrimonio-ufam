import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'
import knex from '@/infra/db/helper/index'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'
const makeSut = (): PatrimonyRepository => {
  return new PatrimonyRepository()
}
const makeNewPatrimony = (): NewPatrimonyModel => ({
  code: 'any_code',
  description: 'any_description',
  state: PatrimonyState.GOOD,
  entryDate: new Date('1/1/2021'),
  lastConferenceDate: new Date('1/1/2021'),
  value: 200,
  patrimonyItens: [
    { name: 'item1', localization: 'any_localization' },
    { name: 'item2', localization: 'any_localization' }
  ]
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
const makePatrimonyToUpdate = (patrimonyId: string, itemid: string): Patrimony => ({
  id: patrimonyId,
  code: 'updated_code',
  description: 'updated_description',
  state: PatrimonyState.UNECONOMICAL,
  entryDate: new Date('1/1/2021'),
  lastConferenceDate: new Date('2/1/2021'),
  value: 220,
  patrimonyItens: [{ id: itemid, name: 'item1_updated', localization: 'updated_localization', observation: 'any_description' }]
})
async function insertSatement (): Promise<string> {
  const [newId] = await knex('responsability_statement').insert({
    responsible_name: 'any_name',
    siape: 'any_code',
    code: 'statement_code',
    emission_date: new Date()
  }).returning('id')
  return newId
}
async function insertItens (id: string): Promise<string> {
  const item = { patrimony_id: id, name: 'item1', localization: 'any_localization' }
  const [itemid] = await knex('patrimony-itens').insert(item).returning('id')
  return itemid
}
describe('PatrimonyRepository', () => {
  beforeAll(async done => {
    await knex.migrate.down()
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('patrimony-itens').del()
    await knex('patrimony').del()
    await knex('responsability_statement').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  describe('DbCheckPatrimonyByCode', () => {
    test('ensure checkByCode returns patrimony data if exists', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const patrimony = await sut.checkByCode('any_code')
      expect(patrimony.code).toEqual('any_code')
      expect(patrimony.id).toEqual(id)
    })
    test('ensure checkByCode returns null if not exists', async () => {
      const sut = makeSut()
      const patrimonyCode = await sut.checkByCode('any_code')
      expect(patrimonyCode).toBeNull()
    })
  })
  describe('DbCreateNewPatrimony', () => {
    test('ensure create insert new patrimony on success', async () => {
      const sut = makeSut()
      const newPatrimony = makeNewPatrimony()
      const newId = await sut.create(newPatrimony)
      const [patrimony] = await knex('patrimony').where({ code: 'any_code' })
      expect(patrimony).toBeTruthy()
      expect(patrimony.id).toEqual(newId)
      expect(patrimony.description).toEqual('any_description')
      expect(patrimony.entry_date).toEqual(new Date('1/1/2021'))
    })
    test('ensure create insert new patrimony itens on success', async () => {
      const sut = makeSut()
      const newPatrimony = makeNewPatrimony()
      const newId = await sut.create(newPatrimony)
      const itens = await knex('patrimony-itens').where({ patrimony_id: newId })
      const newItens = newPatrimony.patrimonyItens
      expect(itens.length).toEqual(newItens.length)
      expect(itens[0].name).toEqual(newItens[0].name)
      expect(itens[1].name).toEqual(newItens[1].name)
    })
    test('ensure create not insert new patrimony if code exists', async () => {
      const sut = makeSut()
      const newPatrimony = makeNewPatrimony()
      await insertPatrimony()
      const response = await sut.create(newPatrimony)
      const itens = await knex('patrimony-itens')
      expect(response).toBeNull()
      expect(itens.length).toEqual(0)
    })
  })
  describe('DbLoadPatrimonyList', () => {
    test('ensure DbLoadPatrimonyList load patrimony itens', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      await insertItens(id)
      await insertItens(id)
      const patrimonies = await sut.load(0, 10)
      expect(patrimonies.length).toBe(1)
      expect(patrimonies[0].code).toEqual('any_code')
    })
    test('ensure DbLoadPatrimonyList load patrimony itens paginated', async () => {
      const sut = makeSut()
      for await (const i of Array(5).keys()) {
        const id = await insertPatrimony(`${i}`)
        await insertItens(id)
        await insertItens(id)
      }
      const firstPage = await sut.load(0, 2)
      expect(firstPage.length).toBe(2)
      const secondPage = await sut.load(2, 2)
      expect(secondPage.length).toBe(2)
      expect(firstPage[0]).not.toEqual(secondPage[0])
      expect(firstPage[0]).not.toEqual(secondPage[1])
      expect(firstPage[1]).not.toEqual(secondPage[0])
      expect(firstPage[1]).not.toEqual(secondPage[1])
    })
  })
  describe('DbUpdatePatrimonyById', () => {
    test('Ensure repository update patrimony by id', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      const patrimonyPayLoad = makePatrimonyToUpdate(id, itemId)
      await sut.updateById(patrimonyPayLoad)
      const [patrimony] = await knex('patrimony').where({ id })
      expect(patrimony).toBeTruthy()
      expect(patrimony.code).toEqual('updated_code')
      expect(patrimony.description).toEqual('updated_description')
    })
    test('Ensure repository update patrimony item', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      const patrimonyPayLoad = makePatrimonyToUpdate(id, itemId)
      await sut.updateById(patrimonyPayLoad)
      const [item] = await knex('patrimony-itens').where({ id: itemId })
      expect(item).toBeTruthy()
      expect(item.name).toEqual('item1_updated')
      expect(item.localization).toEqual('updated_localization')
      expect(item.observation).toEqual('any_description')
    })
    test('Ensure repository throws on error', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      const patrimonyPayLoad = makePatrimonyToUpdate(id, itemId)
      patrimonyPayLoad.code = null
      const res = sut.updateById(patrimonyPayLoad)
      await expect(res).rejects.toThrow()
    })
  })
  describe('DbCheckPatrimonyExistsById', () => {
    test('ensure loadByid returns true if patrimony exists', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const exists = await sut.verifyById(id)
      expect(exists).toBeTruthy()
    })
    test('ensure loadByid returns false if patrimony don\'t exists', async () => {
      const sut = makeSut()
      const fakeUUID = 'cab81c1e-e10c-466f-b17a-49b0dff4f89e'
      const exists = await sut.verifyById(fakeUUID)
      expect(exists).toBeFalsy()
    })
  })
  describe('DbInsertNewItensToPatrimony', () => {
    test('ensure insertNewItens returns true if patrimony exists', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const { patrimonyItens } = makeNewPatrimony()
      await sut.insertItens(id, patrimonyItens)
      const itens = await knex('patrimony-itens').where({ patrimony_id: id })
      expect(itens.length).toBe(2)
    })
  })
  describe('DbDeletePatrimonyItenById', () => {
    test('ensure deleteById deletes one item on pass an id array', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      await sut.deleteItensById(itemId)
      const itens = await knex('patrimony-itens').where({ id: itemId })
      expect(itens.length).toBe(0)
    })
    test('ensure deleteById deletes one item on pass only a id', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      const itemId2 = await insertItens(id)
      await sut.deleteItensById([itemId, itemId2])
      const itens = await knex('patrimony-itens').where({ id: itemId })
      expect(itens.length).toBe(0)
    })
    test('ensure deleteById dont\'t deletes if receive empty array', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      await insertItens(id)
      await sut.deleteItensById(null)
      const itens = await knex('patrimony-itens')
      expect(itens.length).toBe(1)
    })
  })
  describe('DbLoadPatrimonyById', () => {
    test('ensure loadById returns patrimony data if exists', async () => {
      const sut = makeSut()
      const statementId = await insertSatement()
      const id = await insertPatrimony(undefined, statementId)
      const patrimony = await sut.loadById(id)
      expect(patrimony.code).toEqual('any_code')
      expect(patrimony.id).toEqual(id)
      expect(patrimony.statementCode).toEqual('statement_code')
    })
    test('ensure loadById returns null if not exists', async () => {
      const sut = makeSut()
      const patrimonyCode = await sut.loadById('4a189ed2-373d-42a2-80b7-8def350f56a0')
      expect(patrimonyCode).toBeNull()
    })
  })
  describe('DbDeletePatrimonyById', () => {
    test('ensure deleteById deletes patrimony on pass patrimony id', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      await sut.deleteById(id)
      const patrimony = await knex('patrimony').where({ id: itemId })
      const itens = await knex('patrimony-itens').where({ id: itemId })
      expect(patrimony.length).toBe(0)
      expect(itens.length).toBe(0)
    })
    test('ensure deleteById deletes patrimony and itens', async () => {
      const sut = makeSut()
      const id = await insertPatrimony()
      const itemId = await insertItens(id)
      await sut.deleteById(id)
      const itens = await knex('patrimony-itens').where({ id: itemId })
      expect(itens.length).toBe(0)
    })
    test('ensure deleteById dont\'t deletes if receive null', async () => {
      const sut = makeSut()
      await insertPatrimony()
      await sut.deleteById(null)
      const itens = await knex('patrimony')
      expect(itens.length).toBe(1)
    })
  })
  describe('DbLoadPatrimonyIdsByCodes', () => {
    test('ensure loadByCodes returns patrimony ids', async () => {
      const sut = makeSut()
      const id1 = await insertPatrimony('code1')
      const id2 = await insertPatrimony('code2')
      const patrimonies = await sut.loadByCodes(['code1', 'code2'])
      expect(patrimonies.length).toEqual(2)
      expect(patrimonies[0]).toEqual(id1)
      expect(patrimonies[1]).toEqual(id2)
    })
  })
  describe('DbLoadPatrimonyByStatementId', () => {
    test('ensure loadByStatementId returns patrimony data if exists', async () => {
      const sut = makeSut()
      const statementId = await insertSatement()
      const id = await insertPatrimony(undefined, statementId)
      const patrimony = await sut.loadByStatementId(statementId)
      expect(patrimony[0].code).toEqual('any_code')
      expect(patrimony[0].id).toEqual(id)
      expect(patrimony[0].id).toEqual(id)
    })
    test('ensure loadById returns empty array if not exists', async () => {
      const sut = makeSut()
      const patrimonyCode = await sut.loadByStatementId('4a189ed2-373d-42a2-80b7-8def350f56a0')
      expect(patrimonyCode.length).toBe(0)
    })
  })
  describe('DbUpdateStatementIdOnPatrimonyById', () => {
    test('Ensure repository update patrimony by id with statement id', async () => {
      const sut = makeSut()
      const statementId = await insertSatement()
      const id = await insertPatrimony()
      const id2 = await insertPatrimony('any_code2')
      await sut.updateStatement([id, id2], statementId)
      const [patrimony1] = await knex('patrimony').where('id', id)
      const [patrimony2] = await knex('patrimony').where('id', id2)
      expect(patrimony1.id).toEqual(id)
      expect(patrimony2.id).toEqual(id2)
      expect(patrimony1.statement_id).toEqual(statementId)
      expect(patrimony2.statement_id).toEqual(statementId)
    })
  })
})
