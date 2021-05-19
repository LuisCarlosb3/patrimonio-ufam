import { RecoverPasswordController } from '@/presentation/controllers/user/recover-password-controller'
import { GenerateRecoverPasswordLink } from '@/presentation/protocols/generate-link-service'
import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import { HttpRequest } from '@/presentation/protocols/http'
import { serverError } from '@/presentation/protocols/helpers/http-helpers'
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      registration: 'my_registration'
    }
  }
}
const makeFakeUserRecover = (): UserRecoverPassword => {
  class RecoverPasswordStub implements UserRecoverPassword {
    async recover (password: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new RecoverPasswordStub()
}
const makeFakeGenerateLinkService = (): GenerateRecoverPasswordLink => {
  class GeneratePasswordLinkStub implements GenerateRecoverPasswordLink {
    async generate (userRegistration: string): Promise<string> {
      return await Promise.resolve('hash_link')
    }
  }
  return new GeneratePasswordLinkStub()
}

interface SutType {
  sut: RecoverPasswordController
  generateLinkService: GenerateRecoverPasswordLink
  userRecover: UserRecoverPassword
}
const makeSut = (): SutType => {
  const userRecover = makeFakeUserRecover()
  const generateLinkService = makeFakeGenerateLinkService()
  const sut = new RecoverPasswordController(generateLinkService, userRecover)
  return { sut, userRecover, generateLinkService }
}

describe('AuthenticationController', () => {
  test('Ensure AuthenticationController calls generateLinkService with user authentication', async () => {
    const { sut, generateLinkService } = makeSut()
    const generateSpy = jest.spyOn(generateLinkService, 'generate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(generateSpy).toHaveBeenCalledWith(request.body.registration)
  })
  test('Ensure AuthenticationController calls DbAuthentication with user registration and link recover', async () => {
    const { sut, userRecover } = makeSut()
    const authSpy = jest.spyOn(userRecover, 'recover')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body.registration, 'hash_link')
  })
  test('Ensure AuthenticationController return server error on UserRecoverPassword throws', async () => {
    const { sut, userRecover } = makeSut()
    jest.spyOn(userRecover, 'recover').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
})
