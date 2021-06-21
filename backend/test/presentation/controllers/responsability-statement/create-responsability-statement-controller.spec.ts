import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { CreateResponsabilityStatement, CreateStatementModel } from '@/domain/usecase/responsability-statement/create-responsability-statement'
import { CreateResponsabilityStatementController } from '@/presentation/controllers/responsability-statement/create-responsability-statement-controller'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, serverError } from '@/presentation/protocols/helpers/http-helpers'
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
const makeLoadPatrimonyByCode = (): LoadPatrimonyByCode => {
  class LoadPatrimonyByCodeStub implements LoadPatrimonyByCode {
    async loadByCode (code: string): Promise<Patrimony> {
      return await Promise.resolve(makePatrimony())
    }
  }
  return new LoadPatrimonyByCodeStub()
}
const makeCreateResponsabilityStatement = (): CreateResponsabilityStatement => {
  class CreateResponsabilityStatementStub implements CreateResponsabilityStatement {
    async create (newStatement: CreateStatementModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new CreateResponsabilityStatementStub()
}
const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      newStatement: {
        responsibleName: 'any_name',
        siapeCode: 'any_code',
        emissionDate: new Date(),
        patrimoniesCode: ['code1', 'code2']
      }
    }
  }
}
interface SutType {
  sut: CreateResponsabilityStatementController
  validator: Validation
  loadByCode: LoadPatrimonyByCode
  createStatement: CreateResponsabilityStatement
}
const makeSut = (): SutType => {
  const validator = makeFakeValidator()
  const loadByCode = makeLoadPatrimonyByCode()
  const createStatement = makeCreateResponsabilityStatement()
  const sut = new CreateResponsabilityStatementController(validator, loadByCode, createStatement)
  return {
    sut,
    validator,
    loadByCode,
    createStatement
  }
}

describe('CreateResponsabilityStatementController', () => {
  test('Ensure CreateResponsabilityStatementController calls validation with body request', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure CreateResponsabilityStatementController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure CreateResponsabilityStatementController calls loadByCode with codes from request', async () => {
    const { sut, loadByCode } = makeSut()
    const loadByCodeSpy = jest.spyOn(loadByCode, 'loadByCode')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    const codes = request.body.newStatement.patrimoniesCode
    expect(loadByCodeSpy).toHaveBeenNthCalledWith(1, codes[0])
    expect(loadByCodeSpy).toHaveBeenNthCalledWith(2, codes[1])
  })
  test('Ensure CreateResponsabilityStatementController return PatrimonyNotFound if loadByCode returns null', async () => {
    const { sut, loadByCode } = makeSut()
    jest.spyOn(loadByCode, 'loadByCode').mockResolvedValueOnce(null)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    const firstCode = request.body.newStatement.patrimoniesCode[0]
    expect(response).toEqual(badRequest(new PatrimonyNotFound(firstCode)))
  })
  test('Ensure CreateResponsabilityStatementController calls createStatement with body request', async () => {
    const { sut, createStatement } = makeSut()
    const createSpy = jest.spyOn(createStatement, 'create')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(createSpy).toHaveBeenCalledWith(request.body.newStatement)
  })
  test('Ensure CreateResponsabilityStatementController return error on createStatement fails', async () => {
    const { sut, createStatement } = makeSut()
    jest.spyOn(createStatement, 'create').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
})
