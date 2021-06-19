import { DbCreateNewPatrimony } from '@/data/protocols/db/patrimony/db-create-new-patrimony'
import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { CreateNewPatrimonyData } from '@/data/usecases/patrimony/create-new-patrimony'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'

function makeDbCheckPatrimonyByCode (): DbCheckPatrimonyByCode {
  class DbCheckPatrimonyByCodeStub implements DbCheckPatrimonyByCode {
    async checkByCode (code: string): Promise<Patrimony> {
      return await Promise.resolve(null)
    }
  }
  return new DbCheckPatrimonyByCodeStub()
}
function makeDbCreateNewPatrimonytub (): DbCreateNewPatrimony {
  class DbCreateNewPatrimonytub implements DbCreateNewPatrimony {
    async create (newPatrimony: NewPatrimonyModel): Promise<string> {
      return await Promise.resolve('any_id')
    }
  }
  return new DbCreateNewPatrimonytub()
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
function makeFakePatrimony (): Patrimony {
  return {
    id: 'any_id',
    code: 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entryDate: new Date('1/1/2021'),
    lastConferenceDate: new Date('1/1/2021'),
    value: 200,
    patrimonyItens: []
  }
}
interface Sut {
  sut: CreateNewPatrimonyData
  dbCheckPatrimonyByCode: DbCheckPatrimonyByCode
  dbCreateNewPatrimony: DbCreateNewPatrimony
}
function makeSut (): Sut {
  const dbCheckPatrimonyByCode = makeDbCheckPatrimonyByCode()
  const dbCreateNewPatrimony = makeDbCreateNewPatrimonytub()
  const sut = new CreateNewPatrimonyData(dbCheckPatrimonyByCode, dbCreateNewPatrimony)
  return {
    sut,
    dbCheckPatrimonyByCode,
    dbCreateNewPatrimony
  }
}
describe('CreateNewPatrimonyData', () => {
  test('ensure CreateNewPatrimonyData calls checkByCode with received code', async () => {
    const { sut, dbCheckPatrimonyByCode } = makeSut()
    const checkSpy = jest.spyOn(dbCheckPatrimonyByCode, 'checkByCode')
    await sut.create(makeNewPatrimony())
    expect(checkSpy).toHaveBeenCalledWith('any_code')
  })
  test('ensure CreateNewPatrimonyData returns null if code already exists', async () => {
    const { sut, dbCheckPatrimonyByCode } = makeSut()
    jest.spyOn(dbCheckPatrimonyByCode, 'checkByCode').mockResolvedValueOnce(makeFakePatrimony())
    const response = await sut.create(makeNewPatrimony())
    expect(response).toBeFalsy()
  })
  test('ensure CreateNewPatrimonyData calls DbCreateNewPatrimony with new patrimony data', async () => {
    const { sut, dbCreateNewPatrimony } = makeSut()
    const checkSpy = jest.spyOn(dbCreateNewPatrimony, 'create')
    const newPatrimony = makeNewPatrimony()
    await sut.create(newPatrimony)
    expect(checkSpy).toHaveBeenCalledWith(newPatrimony)
  })
  test('ensure CreateNewPatrimonyData returns null on DbCreateNewPatrimony returns null', async () => {
    const { sut, dbCreateNewPatrimony } = makeSut()
    jest.spyOn(dbCreateNewPatrimony, 'create').mockResolvedValueOnce(null)
    const newPatrimony = makeNewPatrimony()
    const response = await sut.create(newPatrimony)
    expect(response).toBeNull()
  })
  test('ensure CreateNewPatrimonyData throws if operation throws', async () => {
    const { sut, dbCreateNewPatrimony } = makeSut()
    jest.spyOn(dbCreateNewPatrimony, 'create').mockRejectedValueOnce(new Error())
    const newPatrimony = makeNewPatrimony()
    const promise = sut.create(newPatrimony)
    await expect(promise).rejects.toThrow()
  })
  test('ensure CreateNewPatrimonyData returns new patrimony id on success ', async () => {
    const { sut } = makeSut()
    const newPatrimony = makeNewPatrimony()
    const response = await sut.create(newPatrimony)
    expect(response).toEqual('any_id')
  })
})
