import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { User, UserPermission } from '@/domain/model/user'
import { UpdatePatrimonyById } from '@/domain/usecase/patrimony/update-patrimony-by-id'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
import { UpdatePatrimonyController } from '@/presentation/controllers/patrimony/update-patrimony-controller'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { CheckPatrimonyIdAndCodeToUpdate } from '@/domain/usecase/patrimony/check-patrimony-id-and-code'
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
const makeFakePatrimony = (): Patrimony => (
  {
    id: 'any_id',
    code: 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entryDate: new Date('1/1/2021'),
    lastConferenceDate: new Date('1/1/2021'),
    value: 200,
    patrimonyItens: []
  }
)
function makeFakeValidator (): Validation {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
function makeUpdatePatrimonyById (): UpdatePatrimonyById {
  class UpdatePatrimonyByIdStub implements UpdatePatrimonyById {
    async updateById (userPermission: UserPermission, patrimony: Patrimony): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new UpdatePatrimonyByIdStub()
}
function makeCheckPatrimonyIdAndCodeToUpdate (): CheckPatrimonyIdAndCodeToUpdate {
  class CheckPatrimonyIdAndCodeToUpdateStub implements CheckPatrimonyIdAndCodeToUpdate {
    async verifyPatrimony (id: string, code: string): Promise<Patrimony | Error> {
      return await Promise.resolve(makeFakePatrimony())
    }
  }
  return new CheckPatrimonyIdAndCodeToUpdateStub()
}
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      accountId: 'user_id',
      patrimony: {
        id: 'any_id',
        code: 'any_code',
        description: 'any_desc',
        state: 'NOVO',
        entryDate: new Date(),
        lastConferenceDate: new Date(),
        value: 500.99,
        patrimonyItens: [
          { name: 'any_item', localization: 'any_localization' },
          { name: 'any_item2', localization: 'any_localization' }
        ]
      }
    }

  }
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
  sut: UpdatePatrimonyController
  validator: Validation
  loadUserById: LoadUserById
  updatePatrimonyById: UpdatePatrimonyById
  checkByIdAndCode: CheckPatrimonyIdAndCodeToUpdate

}
const makeSut = (): Sut => {
  const validator = makeFakeValidator()
  const updatePatrimonyById = makeUpdatePatrimonyById()
  const loadUserById = makeLoadUserById()
  const checkByIdAndCode = makeCheckPatrimonyIdAndCodeToUpdate()

  const sut = new UpdatePatrimonyController(validator, loadUserById, updatePatrimonyById, checkByIdAndCode)
  return { sut, validator, loadUserById, updatePatrimonyById, checkByIdAndCode }
}
describe('UpdatePatrimonyController', () => {
  test('Ensure UpdatePatrimonyController calls validator with body data', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure UpdatePatrimonyController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure UpdatePatrimonyController calls loadUserByid with user id on request body', async () => {
    const { sut, loadUserById } = makeSut()
    const loadSpy = jest.spyOn(loadUserById, 'load')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.body.accountId)
  })
  test('Ensure UpdatePatrimonyController calls updatePatrimonyById with request body', async () => {
    const { sut, updatePatrimonyById } = makeSut()
    const updateSpy = jest.spyOn(updatePatrimonyById, 'updateById')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(updateSpy).toHaveBeenCalledWith(UserPermission.INVENTORIOUS, request.body.patrimony)
  })
  test('Ensure UpdatePatrimonyController returns server error if CreateNewPatrimony throws', async () => {
    const { sut, updatePatrimonyById } = makeSut()
    jest.spyOn(updatePatrimonyById, 'updateById').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure UpdatePatrimonyController returns noContent on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })
  test('Ensure UpdatePatrimonyController returns badRequest  update returns false', async () => {
    const { sut, updatePatrimonyById } = makeSut()
    jest.spyOn(updatePatrimonyById, 'updateById').mockResolvedValueOnce(null)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new PatrimonyNotFound()))
  })
  test.only('Ensure CreateNewPatrimonyController calls checkPatrimonyIdAndCode with patrimony info', async () => {
    const { sut, checkByIdAndCode } = makeSut()
    const verifySpy = jest.spyOn(checkByIdAndCode, 'verifyPatrimony')
    const request = makeFakeHttpRequest()
    const { id, code } = request.body.patrimony
    await sut.handle(request)
    expect(verifySpy).toHaveBeenCalledWith(id, code)
  })
  test.only('Ensure UpdatePatrimonyController returns badRequest  if loadByid returns null', async () => {
    const { sut, checkByIdAndCode } = makeSut()
    jest.spyOn(checkByIdAndCode, 'verifyPatrimony').mockResolvedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new Error()))
  })
})
