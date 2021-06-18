import { DbLoadPatrimonyById } from '@/data/protocols/db/patrimony/db-load-patrimony-by-id'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { LoadPatrimonyByIdData } from '@/data/usecases/patrimony/load-patrimony-by-id'
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
  sut: LoadPatrimonyById
  loadById: DbLoadPatrimonyById
}

const makeSut = (): Sut => {
  const loadById = makeDbLoadPatrimonyById()
  const sut = new LoadPatrimonyByIdData(loadById)
  return {
    sut,
    loadById
  }
}

describe('UpdatePatrimonyByIdData', () => {
  test('Should call checkIfPatrimonyExistsById with patrimony id', async () => {
    const { sut, loadById } = makeSut()
    const loadSpy = jest.spyOn(loadById, 'loadById')
    const patrimony = makeFakePatrimony()
    await sut.laodById(patrimony.id)
    expect(loadSpy).toHaveBeenCalledWith(patrimony.id)
  })
  test('Should return null if verifyById returns null', async () => {
    const { sut, loadById } = makeSut()
    jest.spyOn(loadById, 'loadById').mockResolvedValueOnce(null)
    const patrimony = makeFakePatrimony()
    const res = await sut.laodById(patrimony.id)
    expect(res).toBeNull()
  })
  test('Should throws if updateById throws', async () => {
    const { sut, loadById } = makeSut()
    jest.spyOn(loadById, 'loadById').mockRejectedValueOnce(new Error())
    const patrimony = makeFakePatrimony()
    const promise = sut.laodById(patrimony.id)
    await expect(promise).rejects.toThrow()
  })
})
