import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'
import knex from '@/infra/db/helper/index'
import { PatrimonyState } from '@/domain/model/patrimony'
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
async function insertItens (id: string): Promise<void> {
  const item = { patrimony_id: id, name: 'item1', localization: 'any_localization' }
  await knex('patrimony-itens').insert(item)
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
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  describe('DbCheckPatrimonyByCode', () => {
    test('ensure checkByCode returns patrimony code if exists', async () => {
      const sut = makeSut()
      await insertPatrimony()
      const patrimonyCode = await sut.checkByCode('any_code')
      expect(patrimonyCode).toEqual('any_code')
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
})
