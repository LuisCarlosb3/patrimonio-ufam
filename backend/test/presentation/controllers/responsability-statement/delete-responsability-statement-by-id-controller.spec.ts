import { DeleteResponsabilityStatementeByIdController } from '@/presentation/controllers/responsability-statement/delete-responsability-statement-by-id-controller'
import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { HttpRequest } from '@/presentation/protocols/http'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { StatementHasPatrimony, StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { User, UserPermission } from '@/domain/model/user'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
const makeHttpRequest = (): HttpRequest => ({
  params: {
    id: 'id'
  },
  body: {
    userid: 'my_id'
  }
})
const makeFakeUser = (): User => {
  return {
    id: 'any_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'hash_password',
    permission: UserPermission.INVENTORIOUS
  }
}
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
const makeLoadUserById = (): LoadUserById => {
  class LoadUserByIdStub implements LoadUserById {
    async load (id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }
  return new LoadUserByIdStub()
}

interface Sut {
  sut: DeleteResponsabilityStatementeByIdController
  deleteStatementById: DeleteStatementById
  loadStatementById: LoadStatementById
  loadUserById: LoadUserById
}
const makeSut = (): Sut => {
  const deleteStatementById = makeDeleteStatementById()
  const loadStatementById = makeLoadStatementById()
  const loadUserById = makeLoadUserById()
  const sut = new DeleteResponsabilityStatementeByIdController(deleteStatementById, loadStatementById, loadUserById)
  return {
    sut,
    deleteStatementById,
    loadStatementById,
    loadUserById
  }
}

describe('DeleteResponsabilityStatementeByIdController', () => {
  test('ensure controller calls deleteByIdData with statement id', async () => {
    const { sut, deleteStatementById } = makeSut()
    const deleteSpy = jest.spyOn(deleteStatementById, 'deleteById')
    await sut.handle(makeHttpRequest())
    expect(deleteSpy).toHaveBeenCalledWith('id', 1)
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
  test('Ensure UpdatePatrimonyController calls loadUserByid with user id on request body', async () => {
    const { sut, loadUserById } = makeSut()
    const loadSpy = jest.spyOn(loadUserById, 'load')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.body.accountId)
  })
  test('ensure controller returns 500 on deleteByIdData throws', async () => {
    const { sut, deleteStatementById } = makeSut()
    jest.spyOn(deleteStatementById, 'deleteById').mockRejectedValueOnce(new Error())
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
