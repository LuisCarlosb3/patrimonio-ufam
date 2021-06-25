import { DeleteResponsabilityStatementeByIdController } from '@/presentation/controllers/responsability-statement/delete-responsability-statement-by-id-controller'
import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { HttpRequest } from '@/presentation/protocols/http'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { StatementHasPatrimony, StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
const makeHttpRequest = (): HttpRequest => ({
  params: {
    id: 'id'
  }
})
const makeResponsabilityStatement = (): ResponsabilityStatement => {
  return {
    id: 'any_id',
    code: 'any_code',
    responsibleName: 'any_name',
    siapeCode: 'any_siape',
    emissionDate: new Date(),
    patrimonies: []
  }
}
function makeDeleteStatementById (): DeleteStatementById {
  class DeleteStatementByIdStub implements DeleteStatementById {
    async deleteById (statementId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new DeleteStatementByIdStub()
}
const makeLoadStatementById = (): LoadStatementById => {
  class LoadStatementByIdStub implements LoadStatementById {
    async loadById (id: string): Promise<ResponsabilityStatement> {
      return await Promise.resolve(makeResponsabilityStatement())
    }
  }
  return new LoadStatementByIdStub()
}

interface Sut {
  sut: DeleteResponsabilityStatementeByIdController
  deleteStatementById: DeleteStatementById
  loadStatementById: LoadStatementById
}
const makeSut = (): Sut => {
  const deleteStatementById = makeDeleteStatementById()
  const loadStatementById = makeLoadStatementById()
  const sut = new DeleteResponsabilityStatementeByIdController(deleteStatementById, loadStatementById)
  return {
    sut,
    deleteStatementById,
    loadStatementById
  }
}

describe('DeleteResponsabilityStatementeByIdController', () => {
  test('ensure controller calls deleteByIdData with statement id', async () => {
    const { sut, deleteStatementById } = makeSut()
    const deleteSpy = jest.spyOn(deleteStatementById, 'deleteById')
    await sut.handle(makeHttpRequest())
    expect(deleteSpy).toHaveBeenCalledWith('id')
  })
  test('ensure controller returns 204 on deleteByIdData succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(noContent())
  })
  test('ensure controller returns 400 on deleteByIdData returns false', async () => {
    const { sut, deleteStatementById } = makeSut()
    jest.spyOn(deleteStatementById, 'deleteById').mockResolvedValueOnce(false)
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(badRequest(new StatementHasPatrimony()))
  })
  test('Ensure UpdateStatementController calls loadStatementById with statement id', async () => {
    const { sut, loadStatementById } = makeSut()
    const loadSpy = jest.spyOn(loadStatementById, 'loadById')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.params.id)
  })
  test('Ensure UpdateStatementController returns badRequest if loadStatementById returns null', async () => {
    const { sut, loadStatementById } = makeSut()
    jest.spyOn(loadStatementById, 'loadById').mockResolvedValueOnce(null)
    const request = makeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new StatementNotFound()))
  })
  test('ensure controller returns 500 on deleteByIdData throws', async () => {
    const { sut, deleteStatementById } = makeSut()
    jest.spyOn(deleteStatementById, 'deleteById').mockRejectedValueOnce(new Error())
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
