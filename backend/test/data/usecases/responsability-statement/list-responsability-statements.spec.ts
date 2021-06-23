import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'
import { ListResponsabilityStatementsData } from '@/data/usecases/responsability-statement/list-responsability-statements'
import { DbLoadResponsabilityStatementList } from '@/data/protocols/db/responsability-statement/db-load-statements-list'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import Mockdate from 'mockdate'
const makePatrimonyList = (): ResponsabilityStatement[] => {
  const data = [
    {
      id: 'any_id',
      code: 'any_code',
      responsibleName: 'any_name',
      siapeCode: 'any_siape',
      emissionDate: new Date(),
      patrimonies: []
    }
  ]
  return data
}

const makeDbListResponsabilityStatement = (): DbLoadResponsabilityStatementList => {
  class DbLoadResponsabilityStatementListStub implements DbLoadResponsabilityStatementList {
    async load (page: number, quantityPeerPage: number): Promise<ResponsabilityStatement[]> {
      return await Promise.resolve(makePatrimonyList())
    }
  }
  return new DbLoadResponsabilityStatementListStub()
}

interface Sut {
  sut: ListResponsabilityStatements
  dbLoadStatementList: DbLoadResponsabilityStatementList
}

const makeSut = (): Sut => {
  const dbLoadStatementList = makeDbListResponsabilityStatement()
  const sut = new ListResponsabilityStatementsData(dbLoadStatementList)
  return {
    sut,
    dbLoadStatementList
  }
}

describe('ListResponsabilityStatementsData', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Ensure LoadStatements calls load patrimony repository with quantity and page', async () => {
    const { sut, dbLoadStatementList } = makeSut()
    const loadSpy = jest.spyOn(dbLoadStatementList, 'load')
    await sut.load()
    expect(loadSpy).toHaveBeenCalledWith(0, 10)
  })
  test('Ensure LoadStatements calls load patrimony repository with quantity and page', async () => {
    const { sut, dbLoadStatementList } = makeSut()
    const loadSpy = jest.spyOn(dbLoadStatementList, 'load')
    await sut.load(2)
    expect(loadSpy).toHaveBeenCalledWith(10, 10)
  })
  test('Ensure LoadStatements returns patrimony list from repository', async () => {
    const { sut } = makeSut()
    const list = await sut.load(1)
    expect(list).toEqual(makePatrimonyList())
  })
})
