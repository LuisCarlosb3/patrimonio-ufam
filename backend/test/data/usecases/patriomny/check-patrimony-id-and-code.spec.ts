import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { DbLoadPatrimonyById } from '@/data/protocols/db/patrimony/db-load-patrimony-by-id'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { CheckPatrimonyIdAndCodeToUpdate } from '@/domain/usecase/patrimony/check-patrimony-id-and-code'
import { CheckPatrimonyIdAndCodeToUpdateData } from '@/data/usecases/patrimony/check-patrimony-id-and-code'
import { CodeAlreadyRegistered, PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
function makeDbCheckPatrimonyByCode (): DbCheckPatrimonyByCode {
  class DbCheckPatrimonyByCodeStub implements DbCheckPatrimonyByCode {
    async checkByCode (code: string): Promise<Patrimony> {
      return await Promise.resolve(null)
    }
  }
  return new DbCheckPatrimonyByCodeStub()
}
function makeDbLoadPatrimonyById (): DbLoadPatrimonyById {
  class DbLoadPatrimonyByIdStub implements DbLoadPatrimonyById {
    async loadById (id: string): Promise<Patrimony> {
      return await Promise.resolve(makeFakePatrimony())
    }
  }
  return new DbLoadPatrimonyByIdStub()
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
  sut: CheckPatrimonyIdAndCodeToUpdate
  loadByid: DbLoadPatrimonyById
  loadByCode: DbCheckPatrimonyByCode
}

const makeSut = (): Sut => {
  const loadByid = makeDbLoadPatrimonyById()
  const loadByCode = makeDbCheckPatrimonyByCode()
  const sut = new CheckPatrimonyIdAndCodeToUpdateData(loadByid, loadByCode)
  return {
    sut,
    loadByid,
    loadByCode
  }
}

describe('CheckPatrimonyIdAndCodeToUpdateData', () => {
  test('Should call checkIfPatrimonyExistsById with patrimony id', async () => {
    const { sut, loadByid } = makeSut()
    const check = jest.spyOn(loadByid, 'loadById')
    const patrimony = makeFakePatrimony()
    await sut.verifyPatrimony(patrimony.id, patrimony.code)
    expect(check).toHaveBeenCalledWith(patrimony.id)
  })
  test('Should return null if verifyById returns null', async () => {
    const { sut, loadByid } = makeSut()
    jest.spyOn(loadByid, 'loadById').mockResolvedValueOnce(null)
    const patrimony = makeFakePatrimony()
    const res = await sut.verifyPatrimony(patrimony.id, patrimony.code)
    expect(res).toEqual(new PatrimonyNotFound())
  })
  test('Should throws if updateById throws', async () => {
    const { sut, loadByid } = makeSut()
    jest.spyOn(loadByid, 'loadById').mockRejectedValueOnce(new Error())
    const patrimony = makeFakePatrimony()
    const promise = sut.verifyPatrimony(patrimony.id, patrimony.code)
    await expect(promise).rejects.toThrow()
  })
  test('Should return patrimony if loadedPatrimony has the same code received', async () => {
    const { sut } = makeSut()
    const patrimony = makeFakePatrimony()
    const response = await sut.verifyPatrimony(patrimony.id, patrimony.code)
    expect(response).toEqual(patrimony)
  })
  test('Should call checkPatrimonyByCode if loadedPatrimony dont\' has the same code received', async () => {
    const { sut, loadByCode } = makeSut()
    const load = jest.spyOn(loadByCode, 'checkByCode')
    const patrimony = makeFakePatrimony()
    patrimony.code = 'differente code'
    await sut.verifyPatrimony(patrimony.id, patrimony.code)
    expect(load).toHaveBeenCalledWith(patrimony.code)
  })
  test('Should return codeAlreadyInUse if checkPatrimonyByCode returns a patrimony', async () => {
    const { sut, loadByCode } = makeSut()
    const patrimonyToLoad = makeFakePatrimony()
    jest.spyOn(loadByCode, 'checkByCode').mockResolvedValueOnce(patrimonyToLoad)
    const patrimony = makeFakePatrimony()
    const res = await sut.verifyPatrimony(patrimony.id, 'any_other_code')
    expect(res).toEqual(new CodeAlreadyRegistered())
  })
})
