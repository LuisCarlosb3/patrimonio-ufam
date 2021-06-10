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
async function insertPatrimony (): Promise<void> {
  const patrimony = {
    code: 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entry_date: new Date('1/1/2021'),
    last_conference_date: new Date('1/1/2021'),
    value: 200
  }
  await knex('patrimony').insert(patrimony)
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
})
