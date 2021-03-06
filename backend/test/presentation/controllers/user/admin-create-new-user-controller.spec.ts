import { AdminCreateNewUserController } from '@/presentation/controllers/user/admin-create-new-user-controller'
import { User, UserPermission } from '@/domain/model/user'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
import { CreateNewUser, NewUserModel } from '@/domain/usecase/user/create-user-by-admin'
import { ValueInUseError } from '@/presentation/protocols/helpers/errors'
import SendNewUserAccessLink from '@/data/protocols/email/send-new-user-link'
function makeFakeValidator (): Validation {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
function makeFakeDataCreateNewUser (): CreateNewUser {
  class CreateNewUserStub implements CreateNewUser {
    async create (newUser: NewUserModel): Promise<User> {
      return await Promise.resolve(makeFakeUserData())
    }
  }
  return new CreateNewUserStub()
}
function makeFakeDataSendNewUserAccessLink (): SendNewUserAccessLink {
  class SendNewUserAccessLinkStub implements SendNewUserAccessLink {
    async sendNewNewUserNotify (email: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new SendNewUserAccessLinkStub()
}
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      registration: 'any_registration',
      email: 'any@email',
      permission: UserPermission.INVENTORIOUS,
      password: 'new_password'
    }
  }
}
const makeFakeUserData = (): User => {
  return {
    id: 'any_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    permission: UserPermission.INVENTORIOUS,
    password: 'new_password'
  }
}
interface Sut {
  sut: AdminCreateNewUserController
  validator: Validation
  createNewUser: CreateNewUser
  sendNewUserAccessLink: SendNewUserAccessLink
}
const makeSut = (): Sut => {
  const validator = makeFakeValidator()
  const createNewUser = makeFakeDataCreateNewUser()
  const sendNewUserAccessLink = makeFakeDataSendNewUserAccessLink()
  const sut = new AdminCreateNewUserController(validator, createNewUser, sendNewUserAccessLink)
  return { sut, validator, createNewUser, sendNewUserAccessLink }
}

describe('Uodate Password Controller', () => {
  test('Ensure AdminCreateNewUserController calls validator with request body', async () => {
    const { sut, validator } = makeSut()
    const validatorSpy = jest.spyOn(validator, 'validate')
    await sut.handle(makeFakeHttpRequest())
    const { body } = makeFakeHttpRequest()
    expect(validatorSpy).toHaveBeenCalledWith(body)
  })
  test('Ensure AdminCreateNewUserController returns badRequest on validator fails', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure AdminCreateNewUserController calls create new user with request body', async () => {
    const { sut, createNewUser } = makeSut()
    const createNewUserSpy = jest.spyOn(createNewUser, 'create')
    await sut.handle(makeFakeHttpRequest())
    const { body } = makeFakeHttpRequest()
    expect(createNewUserSpy).toHaveBeenCalledWith(body)
  })
  test('Ensure AdminCreateNewUserController returns ValueInUseError on create user returns array of string', async () => {
    const { sut, createNewUser } = makeSut()
    jest.spyOn(createNewUser, 'create').mockResolvedValueOnce(['email'])
    const res = await sut.handle(makeFakeHttpRequest())
    expect(res).toEqual(badRequest(new ValueInUseError(['email'])))
  })
  test('Ensure AdminCreateNewUserController returns server error on CreateUserThrows', async () => {
    const { sut, createNewUser } = makeSut()
    jest.spyOn(createNewUser, 'create').mockRejectedValueOnce(new Error())
    const res = await sut.handle(makeFakeHttpRequest())
    expect(res).toEqual(serverError(new Error()))
  })

  test('Ensure AdminCreateNewUserController returns calls sendNewUserLink', async () => {
    const { sut, sendNewUserAccessLink } = makeSut()
    const sendLinkSpy = jest.spyOn(sendNewUserAccessLink, 'sendNewNewUserNotify')
    await sut.handle(makeFakeHttpRequest())
    expect(sendLinkSpy).toHaveBeenCalledWith('any@email')
  })
  test('Ensure AdminCreateNewUserController returns noContent on succeeds', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(makeFakeHttpRequest())
    expect(res).toEqual(noContent())
  })
})
