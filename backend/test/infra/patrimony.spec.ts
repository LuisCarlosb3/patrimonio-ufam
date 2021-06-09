import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'
import knex from '@/infra/db/helper/index'
import { PatrimonyState } from '@/domain/model/patrimony'
const makeSut = (): PatrimonyRepository => {
  return new PatrimonyRepository()
}
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
})
