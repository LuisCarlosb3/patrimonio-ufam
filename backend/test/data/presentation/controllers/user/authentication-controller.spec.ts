import { AuthenticationModel, UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { AuthenticationController } from '@/presentation/controllers/user/authentication-controller'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
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

interface SutType {
  sut: AuthenticationController
  userAuth: UserAuthentication
}
const makeSut = (): SutType => {
  const userAuth = makeFakeUserAuth()
  const sut = new AuthenticationController(userAuth)
  return { sut, userAuth }
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
})
