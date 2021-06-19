import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { badRequest, notFound, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { GetPatrimonyByCodeController } from '@/presentation/controllers/patrimony/get-patrimony-by-code-controller'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'

const makeHttpRequest = (): HttpRequest => ({
  params: {
    code: 'any_code'
  }
})

const makePatrimony = (): Patrimony => {
  const data = {
    id: 'any_id',
    code: 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entryDate: new Date('1/1/2021'),
    lastConferenceDate: new Date('1/1/2021'),
    value: 200,
    patrimonyItens: []
  }
  return data
}
function makeFakeValidator (): Validation {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeLoadPatrimonyByCode = (): LoadPatrimonyByCode => {
  class LoadPatrimonyByCodeStub implements LoadPatrimonyByCode {
    async loadByCode (code: string): Promise<Patrimony> {
      return await Promise.resolve(makePatrimony())
    }
  }
  return new LoadPatrimonyByCodeStub()
}

interface Sut {
  sut: GetPatrimonyByCodeController
  loadPatrimony: LoadPatrimonyByCode
  validator: Validation
}

const makeSut = (): Sut => {
  const loadPatrimony = makeLoadPatrimonyByCode()
  const validator = makeFakeValidator()
  const sut = new GetPatrimonyByCodeController(loadPatrimony, validator)
  return {
    sut,
    loadPatrimony,
    validator
  }
}

describe('GetPatrimonyByCodeController', () => {
  test('Ensure GetPatrimonyByCodeController calls LoadPatrimonyByCode', async () => {
    const { sut, loadPatrimony } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimony, 'loadByCode')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.params.code)
  })
  test('Ensure GetPatrimonyByCodeController returns patrimony on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(responseSuccess({ patrimony: makePatrimony() }))
  })
  test('Ensure GetPatrimonyByCodeController returns 403 on patrimony not found', async () => {
    const { sut, loadPatrimony } = makeSut()
    jest.spyOn(loadPatrimony, 'loadByCode').mockResolvedValueOnce(null)
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(notFound(new PatrimonyNotFound()))
  })
  test('Ensure GetPatrimonyByCodeController returns 500 on throws', async () => {
    const { sut, loadPatrimony } = makeSut()
    jest.spyOn(loadPatrimony, 'loadByCode').mockRejectedValueOnce(new Error())
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure GetPatrimonyByCodeController calls validator with body data', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.params)
  })
  test('Ensure GetPatrimonyByCodeController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
})
