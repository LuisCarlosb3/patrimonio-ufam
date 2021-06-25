import { badRequest, notFound, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
import { StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { GetStatementByIdController } from '@/presentation/controllers/responsability-statement/get-responsability-statement-by-id-controller'
import Mockdate from 'mockdate'
const makeHttpRequest = (): HttpRequest => ({
  params: {
    id: 'any_id'
  }
})

const makeStatement = (): ResponsabilityStatement => {
  return {
    id: 'any_id',
    code: 'any_code',
    responsibleName: 'any_name',
    siapeCode: 'any_siape',
    emissionDate: new Date(),
    patrimonies: []
  }
}
function makeFakeValidator (): Validation {
  class ValidationStub implements Validation {
    validate (input: object): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeLoadStatementById = (): LoadStatementById => {
  class LoadStatementByIdStub implements LoadStatementById {
    async loadById (id: string): Promise<ResponsabilityStatement> {
      return await Promise.resolve(makeStatement())
    }
  }
  return new LoadStatementByIdStub()
}

interface Sut {
  sut: GetStatementByIdController
  loadStatement: LoadStatementById
  validator: Validation
}

const makeSut = (): Sut => {
  const loadStatement = makeLoadStatementById()
  const validator = makeFakeValidator()
  const sut = new GetStatementByIdController(loadStatement, validator)
  return {
    sut,
    loadStatement,
    validator
  }
}

describe('GetStatementByIdController', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Ensure GetStatementByIdController calls LoadStatementById', async () => {
    const { sut, loadStatement } = makeSut()
    const loadSpy = jest.spyOn(loadStatement, 'loadById')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.params.id)
  })
  test('Ensure GetStatementByIdController returns statement on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(responseSuccess({ statement: makeStatement() }))
  })
  test('Ensure GetStatementByIdController returns 404 on statement not found', async () => {
    const { sut, loadStatement } = makeSut()
    jest.spyOn(loadStatement, 'loadById').mockResolvedValueOnce(null)
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(notFound(new StatementNotFound()))
  })
  test('Ensure GetStatementByIdController returns 500 on throws', async () => {
    const { sut, loadStatement } = makeSut()
    jest.spyOn(loadStatement, 'loadById').mockRejectedValueOnce(new Error())
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure GetStatementByIdController calls validator with body data', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.params)
  })
  test('Ensure GetStatementByIdController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
})
