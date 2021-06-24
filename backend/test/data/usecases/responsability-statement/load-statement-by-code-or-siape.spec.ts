import { DbLoadResponsabilityStatementListFiltered } from '@/data/protocols/db/responsability-statement/db-load-statements-list'
import { LoadStatementByCodeOrSiape } from '@/domain/usecase/responsability-statement/load-statement-by-code-or-siape'
import { LoadStatementByCodeOrSiapeData } from '@/data/usecases/responsability-statement/load-statement-by-code-or-siape'
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

const makeDbListResponsabilityStatement = (): DbLoadResponsabilityStatementListFiltered => {
  class DbLoadResponsabilityStatementListFilteredStub implements DbLoadResponsabilityStatementListFiltered {
    async loadByCodeOrSiape (filter: string, page: number, quantityPeerPage: number): Promise<ResponsabilityStatement[]> {
      return await Promise.resolve(makePatrimonyList())
    }
  }
  return new DbLoadResponsabilityStatementListFilteredStub()
}

interface Sut {
  sut: LoadStatementByCodeOrSiape
  dbLoadStatementList: DbLoadResponsabilityStatementListFiltered
}

const makeSut = (): Sut => {
  const dbLoadStatementList = makeDbListResponsabilityStatement()
  const sut = new LoadStatementByCodeOrSiapeData(dbLoadStatementList)
  return {
    sut,
    dbLoadStatementList
  }
}

describe('LoadStatementByCodeOrSiapeData', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Ensure LoadStatements calls load patrimony repository with quantity and page', async () => {
    const { sut, dbLoadStatementList } = makeSut()
    const loadSpy = jest.spyOn(dbLoadStatementList, 'loadByCodeOrSiape')
    await sut.loadByCodeOrSiape('any_code')
    expect(loadSpy).toHaveBeenCalledWith('any_code', 0, 10)
  })
  test('Ensure LoadStatements calls load patrimony repository with quantity and page', async () => {
    const { sut, dbLoadStatementList } = makeSut()
    const loadSpy = jest.spyOn(dbLoadStatementList, 'loadByCodeOrSiape')
    await sut.loadByCodeOrSiape('any_code', 2)
    expect(loadSpy).toHaveBeenCalledWith('any_code', 10, 10)
  })
  test('Ensure LoadStatements returns patrimony list from repository', async () => {
    const { sut } = makeSut()
    const list = await sut.loadByCodeOrSiape('any_code', 1)
    expect(list).toEqual(makePatrimonyList())
  })
})
