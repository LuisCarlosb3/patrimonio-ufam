import { AuthenticationModel, UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { AuthenticationController } from '@/presentation/controllers/user/authentication-controller'
import { badRequest, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { Validation } from '@/presentation/protocols/validation'
import { HttpRequest } from '@/presentation/protocols/http'
import { MissingParamError } from '@/presentation/protocols/helpers/errors'
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      registration: 'my_registration',
      password: 'my_password'
    }
  }
}
const makeFakeUserAuth = (): UserAuthentication => {
  class UserAuthenticationStub implements UserAuthentication {
    async auth (auth: AuthenticationModel): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new UserAuthenticationStub()
}
const makeFakeValidator = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutType {
  sut: AuthenticationController
  userAuth: UserAuthentication
  validator: Validation
}
const makeSut = (): SutType => {
  const userAuth = makeFakeUserAuth()
  const validator = makeFakeValidator()
  const sut = new AuthenticationController(userAuth, validator)
  return { sut, userAuth, validator }
}

describe('AuthenticationController', () => {
  test('Ensure AuthenticationController calls DbAuthentication with authentication model', async () => {
    const { sut, userAuth } = makeSut()
    const authSpy = jest.spyOn(userAuth, 'auth')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure AuthenticationController return server error if DbAuthentication throws', async () => {
    const { sut, userAuth } = makeSut()
    jest.spyOn(userAuth, 'auth').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure AuthenticationController returns token returned by DbAuthentication', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(responseSuccess({
      token: 'any_token'
    }))
  })
  test('Ensure AuthenticationController calls AuthValidator with body params', async () => {
    const { sut, validator } = makeSut()
    const validatorSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validatorSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure AuthenticationController returns error if validator returns error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new MissingParamError('registration'))
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new MissingParamError('registration')))
  })
})
