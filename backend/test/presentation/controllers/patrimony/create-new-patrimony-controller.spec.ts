import { CreateNewPatrimony, NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'
import { CreateNewpatrimonyController } from '@/presentation/controllers/patrimony/create-new-patrimony-controller'
import { ValueInUseError } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
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
function makeCreateNewPatrimony (): CreateNewPatrimony {
  class CreateNewPatrimonyStub implements CreateNewPatrimony {
    async create (newPatrimony: NewPatrimonyModel): Promise<string> {
      return await Promise.resolve('new_id')
    }
  }
  return new CreateNewPatrimonyStub()
}
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
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
interface Sut {
  sut: CreateNewpatrimonyController
  validator: Validation
  createNewPatrimony: CreateNewPatrimony
}
const makeSut = (): Sut => {
  const validator = makeFakeValidator()
  const createNewPatrimony = makeCreateNewPatrimony()
  const sut = new CreateNewpatrimonyController(validator, createNewPatrimony)
  return { sut, validator, createNewPatrimony }
}
describe('CreateNewPatrimonyController', () => {
  test('Ensure CreateNewPatrimonyController calls validator with body data', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure CreateNewPatrimonyController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure CreateNewPatrimonyController calls CreateNewPatrimony with request body', async () => {
    const { sut, createNewPatrimony } = makeSut()
    const createSpy = jest.spyOn(createNewPatrimony, 'create')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(createSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure CreateNewPatrimonyController returns server error if CreateNewPatrimony throws', async () => {
    const { sut, createNewPatrimony } = makeSut()
    jest.spyOn(createNewPatrimony, 'create').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure CreateNewPatrimonyController returns valueInUseError if create fails', async () => {
    const { sut, createNewPatrimony } = makeSut()
    jest.spyOn(createNewPatrimony, 'create').mockResolvedValueOnce(null)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new ValueInUseError(['code'])))
  })
  test('Ensure CreateNewPatrimonyController returns noContent on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })
})
