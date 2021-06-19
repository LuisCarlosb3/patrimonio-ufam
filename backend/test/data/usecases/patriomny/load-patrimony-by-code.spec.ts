import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { LoadPatrimonyByCodeData } from '@/data/usecases/patrimony/load-patrimony-by-code'
function makeDbCheckPatrimonyByCode (): DbCheckPatrimonyByCode {
  class DbCheckPatrimonyByCodeStub implements DbCheckPatrimonyByCode {
    async checkByCode (code: string): Promise<Patrimony> {
      return await Promise.resolve(makeFakePatrimony())
    }
  }
  return new DbCheckPatrimonyByCodeStub()
}
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
  sut: LoadPatrimonyByCode
  loadByCode: DbCheckPatrimonyByCode
}

const makeSut = (): Sut => {
  const loadByCode = makeDbCheckPatrimonyByCode()
  const sut = new LoadPatrimonyByCodeData(loadByCode)
  return {
    sut,
    loadByCode
  }
}

describe('UpdatePatrimonyByIdData', () => {
  test('Should call checkIfPatrimonyExistsById with patrimony id', async () => {
    const { sut, loadByCode } = makeSut()
    const loadSpy = jest.spyOn(loadByCode, 'checkByCode')
    const patrimony = makeFakePatrimony()
    await sut.loadByCode(patrimony.id)
    expect(loadSpy).toHaveBeenCalledWith(patrimony.id)
  })
  test('Should return null if verifyById returns null', async () => {
    const { sut, loadByCode } = makeSut()
    jest.spyOn(loadByCode, 'checkByCode').mockResolvedValueOnce(null)
    const patrimony = makeFakePatrimony()
    const res = await sut.loadByCode(patrimony.id)
    expect(res).toBeNull()
  })
  test('Should throws if updateById throws', async () => {
    const { sut, loadByCode } = makeSut()
    jest.spyOn(loadByCode, 'checkByCode').mockRejectedValueOnce(new Error())
    const patrimony = makeFakePatrimony()
    const promise = sut.loadByCode(patrimony.id)
    await expect(promise).rejects.toThrow()
  })
})
