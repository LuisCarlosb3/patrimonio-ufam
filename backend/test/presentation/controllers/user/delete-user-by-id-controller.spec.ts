import { DeleteUserByIdController } from '@/presentation/controllers/user/delete-user-by-id-controller'
import { MissingParamError } from '@/presentation/protocols/helpers/errors'
import { badRequest, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { User, UserPermission } from '@/domain/model/user'
import { DeleteUserById } from '@/domain/usecase/user/delete-user-by-id'
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    params: {
      id: 'other_id'
    },
    body: {
      accountId: 'any_id'
    }
  }
}
const makeFakeUser = (): User => {
  return {
    id: 'other_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'hash_password',
    permission: UserPermission.INVENTORIOUS
  }
}
const makeFakeValidator = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeLoadUserById = (): LoadUserById => {
  class LoadUserByIdStub implements LoadUserById {
    async load (id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }
  return new LoadUserByIdStub()
}
const makeDeleteUserById = (): DeleteUserById => {
  class DeleteUserByIdStub implements DeleteUserById {
    async deleteById (userId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DeleteUserByIdStub()
}
interface SutType {
  sut: DeleteUserByIdController
  loadUserById: LoadUserById
  deleteUserById: DeleteUserById
  validator: Validation
}
const makeSut = (): SutType => {
  const validator = makeFakeValidator()
  const loadUserById = makeLoadUserById()
  const deleteUserById = makeDeleteUserById()
  const sut = new DeleteUserByIdController(deleteUserById, validator, loadUserById)
  return { sut, validator, loadUserById, deleteUserById }
}

describe('DeleteUserByIdController', () => {
  test('Ensure deleteController calls AuthValidator with params', async () => {
    const { sut, validator } = makeSut()
    const validatorSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validatorSpy).toHaveBeenCalledWith(request.params)
  })
  test('Ensure deleteController returns error if validator returns error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new MissingParamError('id'))
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('id')))
  })
  test('Ensure deleteController calls loadUser with user id', async () => {
    const { sut, loadUserById } = makeSut()
    const loadSpy = jest.spyOn(loadUserById, 'load')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.params.id)
  })
  test('Ensure deleteController returns server error if loadUser throws', async () => {
    const { sut, loadUserById } = makeSut()
    jest.spyOn(loadUserById, 'load').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure deleteController calls deleteUser with user id', async () => {
    const { sut, deleteUserById } = makeSut()
    const deleteSpy = jest.spyOn(deleteUserById, 'deleteById')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(deleteSpy).toHaveBeenCalledWith(request.params.id)
  })
  test('Ensure deleteController don\'t calls deleteUser if user to delete id is same as user logged', async () => {
    const { sut, deleteUserById } = makeSut()
    const deleteSpy = jest.spyOn(deleteUserById, 'deleteById')

    const request = makeFakeHttpRequest()
    request.params.id = 'any_id'
    const response = await sut.handle(request)
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(response).toEqual(badRequest(new Error('You cannot delete your account')))
  })
})
