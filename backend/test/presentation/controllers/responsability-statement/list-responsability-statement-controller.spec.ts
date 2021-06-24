import { ListResponsabilityStatementController } from '@/presentation/controllers/responsability-statement/list-resposability-statement-controller'
import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { LoadStatementByCodeOrSiape } from '@/domain/usecase/responsability-statement/load-statement-by-code-or-siape'
import { HttpRequest } from '@/presentation/protocols/http'
import Mockdata from 'mockdate'
const makeHttpRequest = (): HttpRequest => ({
  params: {
    page: 1
  }
})

const makeStatementList = (quantity = 10): ResponsabilityStatement[] => {
  const data = []
  for (const i of Array(quantity).keys()) {
    data.push(
      { id: `id_${i}`, code: 'any_code', responsibleName: 'any_name', siapeCode: 'any_siape', emissionDate: new Date(), patrimonies: [] }

    )
  }
  console.log(data)
  return data
}
const makeListResponsabilityStatements = (): ListResponsabilityStatements => {
  class ListResponsabilityStatementsStub implements ListResponsabilityStatements {
    async load (page?: number): Promise<ResponsabilityStatement[]> {
      return await Promise.resolve(makeStatementList())
    }
  }
  return new ListResponsabilityStatementsStub()
}
const makeLoadStatementByCodeOrSiape = (): LoadStatementByCodeOrSiape => {
  class LoadStatementByCodeOrSiapeStub implements LoadStatementByCodeOrSiape {
    async loadByCodeOrSiape (filter: string, page?: number): Promise<ResponsabilityStatement[]> {
      return await Promise.resolve(makeStatementList(5))
    }
  }
  return new LoadStatementByCodeOrSiapeStub()
}

interface Sut {
  sut: ListResponsabilityStatementController
  loadStatementList: ListResponsabilityStatements
  loadResponsabilityWithFilter: LoadStatementByCodeOrSiape
}

const makeSut = (): Sut => {
  const loadStatementList = makeListResponsabilityStatements()
  const loadResponsabilityWithFilter = makeLoadStatementByCodeOrSiape()
  const sut = new ListResponsabilityStatementController(loadStatementList, loadResponsabilityWithFilter)
  return {
    sut,
    loadStatementList,
    loadResponsabilityWithFilter
  }
}

describe('ListPatrimonyController', () => {
  beforeAll(() => {
    Mockdata.set(new Date())
  })
  afterAll(() => {
    Mockdata.reset()
  })
  test('Ensure ListPatrimonyController calls loadStatementList', async () => {
    const { sut, loadStatementList } = makeSut()
    const loadSpy = jest.spyOn(loadStatementList, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(1)
  })
  test('Ensure ListPatrimonyController calls loadStatementList', async () => {
    const { sut, loadStatementList } = makeSut()
    const loadSpy = jest.spyOn(loadStatementList, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith(0)
  })
  test('Ensure ListPatrimonyController calls loadStatementList with 0 if invalid number passed', async () => {
    const { sut, loadStatementList } = makeSut()
    const loadSpy = jest.spyOn(loadStatementList, 'load')
    await sut.handle({ params: -1 })
    expect(loadSpy).toHaveBeenCalledWith(0)
  })
  test('Ensure ListPatrimonyController calls loadStatementList', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(responseSuccess({ statementList: makeStatementList() }))
  })
  test('Ensure ListPatrimonyController returns 500 on throws', async () => {
    const { sut, loadStatementList } = makeSut()
    jest.spyOn(loadStatementList, 'load').mockRejectedValueOnce(new Error())
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure ListPatrimonyController calls loadResponsabilityWithFilter if have query', async () => {
    const { sut, loadResponsabilityWithFilter } = makeSut()
    const request = makeHttpRequest()
    request.query = {
      filter: '123'
    }
    const loadSpy = jest.spyOn(loadResponsabilityWithFilter, 'loadByCodeOrSiape')
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith('123', 1)
  })
  test('Ensure ListPatrimonyController don\'t calls loadResponsabilityWithFilter if no have query', async () => {
    const { sut, loadResponsabilityWithFilter } = makeSut()
    const request = makeHttpRequest()
    const loadSpy = jest.spyOn(loadResponsabilityWithFilter, 'loadByCodeOrSiape')
    await sut.handle(request)
    expect(loadSpy).not.toHaveBeenCalled()
  })
  test('Ensure ListPatrimonyController returns filtered list if have filter', async () => {
    const { sut } = makeSut()
    const request = makeHttpRequest()
    request.query = {
      filter: '123'
    }
    const response = await sut.handle(request)
    expect(response).toEqual(responseSuccess({ statementList: makeStatementList(5) }))
  })
})
