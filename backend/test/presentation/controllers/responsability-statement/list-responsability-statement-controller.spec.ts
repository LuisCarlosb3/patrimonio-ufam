import { ListResponsabilityStatementController } from '@/presentation/controllers/responsability-statement/list-resposability-statement-controller'
import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { HttpRequest } from '@/presentation/protocols/http'
import Mockdata from 'mockdate'
const makeHttpRequest = (): HttpRequest => ({
  params: {
    page: 1
  }
})

const makeStatementList = (): ResponsabilityStatement[] => {
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
const makeListResponsabilityStatements = (): ListResponsabilityStatements => {
  class ListResponsabilityStatementsStub implements ListResponsabilityStatements {
    async load (page?: number): Promise<ResponsabilityStatement[]> {
      return await Promise.resolve(makeStatementList())
    }
  }
  return new ListResponsabilityStatementsStub()
}

interface Sut {
  sut: ListResponsabilityStatementController
  loadStatementList: ListResponsabilityStatements
}

const makeSut = (): Sut => {
  const loadStatementList = makeListResponsabilityStatements()
  const sut = new ListResponsabilityStatementController(loadStatementList)
  return {
    sut,
    loadStatementList
  }
}

describe('ListPatrimonyController', () => {
  beforeAll(() => {
    Mockdata.set(new Date())
  })
  afterAll(() => {
    Mockdata.reset()
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList', async () => {
    const { sut, loadStatementList } = makeSut()
    const loadSpy = jest.spyOn(loadStatementList, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith(1)
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList', async () => {
    const { sut, loadStatementList } = makeSut()
    const loadSpy = jest.spyOn(loadStatementList, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith(0)
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList with 0 if invalid number passed', async () => {
    const { sut, loadStatementList } = makeSut()
    const loadSpy = jest.spyOn(loadStatementList, 'load')
    await sut.handle({ params: -1 })
    expect(loadSpy).toHaveBeenCalledWith(0)
  })
  test('Ensure ListPatrimonyController calls LoadPatrimonyList', async () => {
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
})
