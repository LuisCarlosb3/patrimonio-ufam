import { DeleteResponsabilityStatementeByIdController } from '@/presentation/controllers/responsability-statement/delete-responsability-statement-by-id-controller'
import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { HttpRequest } from '@/presentation/protocols/http'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { StatementHasPatrimony } from '@/presentation/protocols/helpers/errors'
const makeHttpRequest = (): HttpRequest => ({
  params: {
    id: 'id'
  }
})
function makeDeleteStatementById (): DeleteStatementById {
  class DeleteStatementByIdStub implements DeleteStatementById {
    async deleteById (statementId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new DeleteStatementByIdStub()
}

interface Sut {
  sut: DeleteResponsabilityStatementeByIdController
  deleteStatementById: DeleteStatementById
}
const makeSut = (): Sut => {
  const deleteStatementById = makeDeleteStatementById()
  const sut = new DeleteResponsabilityStatementeByIdController(deleteStatementById)
  return {
    sut,
    deleteStatementById
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
  test('ensure controller returns 500 on deleteByIdData throws', async () => {
    const { sut, deleteStatementById } = makeSut()
    jest.spyOn(deleteStatementById, 'deleteById').mockRejectedValueOnce(new Error())
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
