import { RecoverPasswordController } from '@/presentation/controllers/user/recover-password-controller'
import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import { HttpRequest } from '@/presentation/protocols/http'
import { badRequest, noContent, serverError, unauthorizedRequest } from '@/presentation/protocols/helpers/http-helpers'
import { Validation } from '@/presentation/protocols/validation'
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      registration: 'my_registration'
    }
  }
}
const makeFakeUserRecover = (): UserRecoverPassword => {
  class RecoverPasswordStub implements UserRecoverPassword {
    async recover (registration: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new RecoverPasswordStub()
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
  sut: RecoverPasswordController
  userRecover: UserRecoverPassword
  validator: Validation
}
const makeSut = (): SutType => {
  const userRecover = makeFakeUserRecover()
  const validator = makeFakeValidator()
  const sut = new RecoverPasswordController(userRecover, validator)
  return { sut, userRecover, validator }
}

describe('AuthenticationController', () => {
  test('Ensure AuthenticationController calls DbAuthentication with user registration and link recover', async () => {
    const { sut, userRecover } = makeSut()
    const authSpy = jest.spyOn(userRecover, 'recover')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.body.registration)
  })
  test('Ensure AuthenticationController return server error on UserRecoverPassword throws', async () => {
    const { sut, userRecover } = makeSut()
    jest.spyOn(userRecover, 'recover').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure AuthenticationController returns noAuthorized if DbAuthentication returns false', async () => {
    const { sut, userRecover } = makeSut()
    jest.spyOn(userRecover, 'recover').mockResolvedValueOnce(false)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(unauthorizedRequest())
  })
  test('Ensure AuthenticationController returns noContent if DbAuthentication returns true', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })
  test('Ensure AuthenticationController calls validation with body request', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure AuthenticationController returns badRequest on validation returns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle({ body: {} })
    expect(response).toEqual(badRequest(new Error()))
  })
})
