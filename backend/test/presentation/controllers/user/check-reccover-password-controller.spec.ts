import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'
import { CheckRecoverLinkController } from '@/presentation/controllers/user/check-recover-password-controller'
import { badRequest, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    params: {
      link: 'my_hash_link'
    }
  }
}

function makeCheckLinkRecover (): CheckUserRecoverLink {
  class CheckUserRecoverLinkStub implements CheckUserRecoverLink {
    async verify (link: string): Promise<string> {
      return await Promise.resolve('user_id')
    }
  }
  return new CheckUserRecoverLinkStub()
}
function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
interface SutType {
  sut: CheckRecoverLinkController
  checkLink: CheckUserRecoverLink
  validation: Validation
}
const makeSut = (): SutType => {
  const checkLink = makeCheckLinkRecover()
  const validation = makeValidation()
  const sut = new CheckRecoverLinkController(checkLink, validation)
  return { sut, checkLink, validation }
}

describe('CheckRecoverPasswordController', () => {
  test('Ensure Recover Password calls DbLoadUserByUrl with request url', async () => {
    const { sut, checkLink } = makeSut()
    const authSpy = jest.spyOn(checkLink, 'verify')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.params.link)
  })
  test('Ensure returns  server error on DbLoadUserByUrl throws', async () => {
    const { sut, checkLink } = makeSut()
    jest.spyOn(checkLink, 'verify').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure returns badRequest on validation fail', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle({ params: {} })
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure returns user id on succeeds', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(responseSuccess('user_id'))
  })
})
