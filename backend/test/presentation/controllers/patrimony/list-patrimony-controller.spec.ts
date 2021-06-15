import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { LoadPatrimonyList } from '@/domain/usecase/patrimony/list-patrimony'
import { ListPatrimonyController } from '@/presentation/controllers/patrimony/list-patrimony-controller'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'

const makeHttpRequest = (): HttpRequest => ({
  params: {
    page: 1
  }
})

const makePatrimonyList = (): Patrimony[] => {
  const data = [
    {
      id: 'any_id',
      code: 'any_code',
      description: 'any_description',
      state: PatrimonyState.GOOD,
      entryDate: new Date('1/1/2021'),
      lastConferenceDate: new Date('1/1/2021'),
      value: 200,
      patrimonyItens: []
    }
  ]
  return data
}
const makeLoadPatrimonyList = (): LoadPatrimonyList => {
  class LoadPatrimonyListStub implements LoadPatrimonyList {
    async load (page?: number): Promise<Patrimony[]> {
      return await Promise.resolve(makePatrimonyList())
    }
  }
  return new LoadPatrimonyListStub()
}

interface Sut {
  sut: ListPatrimonyController
  loadPatrimonyList: LoadPatrimonyList
}

const makeSut = (): Sut => {
  const loadPatrimonyList = makeLoadPatrimonyList()
  const sut = new ListPatrimonyController(loadPatrimonyList)
  return {
    sut,
    loadPatrimonyList
  }
}

describe('ListPatrimonyController', () => {
  test('Ensure ListPatrimonyController calls LoadPatrimonyList', async () => {
    const { sut, loadPatrimonyList } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimonyList, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(1)
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList', async () => {
    const { sut, loadPatrimonyList } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimonyList, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith(0)
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList with 0 if invalid number passed', async () => {
    const { sut, loadPatrimonyList } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimonyList, 'load')
    await sut.handle({ params: -1 })
    expect(loadSpy).toHaveBeenCalledWith(0)
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(responseSuccess(makePatrimonyList()))
  })
  test('Ensure ListPatrimonyController returns 500 on throws', async () => {
    const { sut, loadPatrimonyList } = makeSut()
    jest.spyOn(loadPatrimonyList, 'load').mockRejectedValueOnce(new Error())
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
})
