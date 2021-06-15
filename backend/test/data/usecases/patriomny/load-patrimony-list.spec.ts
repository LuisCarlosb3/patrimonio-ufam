import { DbLoadPatrimonyList } from '@/data/protocols/db/patrimony/db-load-patrimony-list'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { LoadPatrimonyList } from '@/domain/usecase/patrimony/list-patrimony'
import { LoadPatrimonyListData } from '@/data/usecases/patrimony/load-patrimony-list'

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

const makeDbLoadPatrimonyList = (): DbLoadPatrimonyList => {
  class DbLoadPatrimonyListStub implements DbLoadPatrimonyList {
    async load (page: number, quantityPeerPage: number): Promise<Patrimony[]> {
      return await Promise.resolve(makePatrimonyList())
    }
  }
  return new DbLoadPatrimonyListStub()
}

interface Sut {
  sut: LoadPatrimonyList
  dbLoadPatrimonyList: DbLoadPatrimonyList
}

const makeSut = (): Sut => {
  const dbLoadPatrimonyList = makeDbLoadPatrimonyList()
  const sut = new LoadPatrimonyListData(dbLoadPatrimonyList)
  return {
    sut,
    dbLoadPatrimonyList
  }
}

describe('LoadPatrimonyList', () => {
  test('Ensure LoadPatrimonyList calls load patrimony repository with quantity and page', async () => {
    const { sut, dbLoadPatrimonyList } = makeSut()
    const loadSpy = jest.spyOn(dbLoadPatrimonyList, 'load')
    await sut.load()
    expect(loadSpy).toHaveBeenCalledWith(0, 10)
  })
  test('Ensure LoadPatrimonyList calls load patrimony repository with quantity and page', async () => {
    const { sut, dbLoadPatrimonyList } = makeSut()
    const loadSpy = jest.spyOn(dbLoadPatrimonyList, 'load')
    await sut.load(2)
    expect(loadSpy).toHaveBeenCalledWith(10, 10)
  })
  test('Ensure LoadPatrimonyList returns patrimony list from repository', async () => {
    const { sut } = makeSut()
    const list = await sut.load(1)
    expect(list).toEqual(makePatrimonyList())
  })
})
