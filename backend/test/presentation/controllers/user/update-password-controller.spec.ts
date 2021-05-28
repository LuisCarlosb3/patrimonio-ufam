import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'
import { UserUpdatePassword } from '@/domain/usecase/user/user-update-password'
import { UpdatePasswordController } from '@/presentation/controllers/user/update-password-controller'
import { badRequest, noContent, serverError, unauthorizedRequest } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
function makeFakeValidator (): Validation {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
function makeCheckLinkRecover (): CheckUserRecoverLink {
  class CheckUserRecoverLinkStub implements CheckUserRecoverLink {
    async verify (link: string): Promise<string> {
      return await Promise.resolve('user_id')
    }
  }
  return new CheckUserRecoverLinkStub()
}
function makeUserUpdatePassword (): UserUpdatePassword {
  class UserUpdatePasswordStub implements UserUpdatePassword {
    async updatePassword (userId: string, newPassword: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new UserUpdatePasswordStub()
}
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      password: 'any_password',
      passwordConfirmation: 'any_password'
    },
    params: {
      link: 'any_link'
    }
  }
}
interface Sut {
  sut: UpdatePasswordController
  validator: Validation
  checkLink: CheckUserRecoverLink
  updatePassword: UserUpdatePassword
}
const makeSut = (): Sut => {
  const validator = makeFakeValidator()
  const checkLink = makeCheckLinkRecover()
  const updatePassword = makeUserUpdatePassword()
  const sut = new UpdatePasswordController(validator, checkLink, updatePassword)
  return { sut, validator, checkLink, updatePassword }
}

describe('Uodate Password Controller', () => {
  test('Ensure UpdatePasswordController calls validator with request body', async () => {
    const { sut, validator } = makeSut()
    const validatorSpy = jest.spyOn(validator, 'validate')
    await sut.handle(makeFakeHttpRequest())
    const { params, body } = makeFakeHttpRequest()
    expect(validatorSpy).toHaveBeenCalledWith({ ...params, ...body })
  })
  test('Ensure UpdatePasswordController returns badRequest on validator fails', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure UpdatePasswordController calls verify with link', async () => {
    const { sut, checkLink } = makeSut()
    const authSpy = jest.spyOn(checkLink, 'verify')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith(request.params.link)
  })
  test('Ensure UpdatePasswordController returns unauthorized on verify link returns null', async () => {
    const { sut, checkLink } = makeSut()
    jest.spyOn(checkLink, 'verify').mockResolvedValueOnce(null)
    const request = makeFakeHttpRequest()
    const res = await sut.handle(request)
    expect(res).toEqual(unauthorizedRequest())
  })
  test('Ensure UpdatePasswordController returns server error if verify throws', async () => {
    const { sut, checkLink } = makeSut()
    jest.spyOn(checkLink, 'verify').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const res = await sut.handle(request)
    expect(res).toEqual(serverError(new Error()))
  })
  test('Ensure UpdatePasswordController calls update password with userId and new password', async () => {
    const { sut, updatePassword } = makeSut()
    const updateSpy = jest.spyOn(updatePassword, 'updatePassword')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(updateSpy).toHaveBeenCalledWith('user_id', 'any_password')
  })
  test('Ensure UpdatePasswordController returns server error if verify throws', async () => {
    const { sut, updatePassword } = makeSut()
    jest.spyOn(updatePassword, 'updatePassword').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const res = await sut.handle(request)
    expect(res).toEqual(serverError(new Error()))
  })
  test('Ensure UpdatePasswordController returns noContent on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const res = await sut.handle(request)
    expect(res).toEqual(noContent())
  })
})
