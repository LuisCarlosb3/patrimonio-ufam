import { UpdateStatementById, UpdateStatementModel } from '@/domain/usecase/responsability-statement/update-statement-by-id'
import { UpdateStatementController } from '@/presentation/controllers/responsability-statement/update-statement-by-id-controller'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { PatrimonyHasStatement, PatrimonyNotFound, StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { Validation } from '@/presentation/protocols/validation'
import { HttpRequest } from '@/presentation/protocols/http'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
const makeResponsabilityStatement = (): ResponsabilityStatement => {
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
function makeUpdateStatementById (): UpdateStatementById {
  class UpdateStatementByIdStub implements UpdateStatementById {
    async updateById (statement: UpdateStatementModel): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new UpdateStatementByIdStub()
}
const makeLoadStatementById = (): LoadStatementById => {
  class LoadStatementByIdStub implements LoadStatementById {
    async loadById (id: string): Promise<ResponsabilityStatement> {
      return await Promise.resolve(makeResponsabilityStatement())
    }
  }
  return new LoadStatementByIdStub()
}
const makeFakePatrimony = (id?: string): Patrimony => (
  {
    id: id || 'any_id',
    code: id || 'any_code',
    description: 'any_description',
    state: PatrimonyState.GOOD,
    entryDate: new Date('1/1/2021'),
    lastConferenceDate: new Date('1/1/2021'),
    value: 200,
    patrimonyItens: []
  }
)
function makeLoadPatrimonyById (): LoadPatrimonyById {
  class LoadPatrimonyByIdStub implements LoadPatrimonyById {
    async laodById (id: string): Promise<Patrimony> {
      return await Promise.resolve(makeFakePatrimony(id))
    }
  }
  return new LoadPatrimonyByIdStub()
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
    body: {
      statement: {
        id: 'any_id',
        responsibleName: 'any_name',
        siapeCode: 'any_siape',
        emissionDate: new Date(),
        removedPatrimonies: ['id_delete1', 'id_delete2'],
        addedPatrimonies: ['id_add1', 'id_add2']
      }
    }

  }
}

interface Sut {
  sut: UpdateStatementController
  validator: Validation
  updateStatementById: UpdateStatementById
  loadPatrimonyById: LoadPatrimonyById
  loadStatementById: LoadStatementById

}
const makeSut = (): Sut => {
  const validator = makeFakeValidator()
  const updateStatementById = makeUpdateStatementById()
  const loadPatrimonyById = makeLoadPatrimonyById()
  const loadStatementById = makeLoadStatementById()

  const sut = new UpdateStatementController(validator, updateStatementById, loadPatrimonyById, loadStatementById)
  return { sut, validator, updateStatementById, loadPatrimonyById, loadStatementById }
}
describe('UpdateStatementController', () => {
  test('Ensure UpdateStatementController calls validator with body data', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
  test('Ensure UpdateStatementController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure UpdateStatementController calls loadStatementById with statement id', async () => {
    const { sut, loadStatementById } = makeSut()
    const loadSpy = jest.spyOn(loadStatementById, 'loadById')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.body.statement.id)
  })
  test('Ensure UpdateStatementController returns badRequest if loadStatementById returns null', async () => {
    const { sut, loadStatementById } = makeSut()
    jest.spyOn(loadStatementById, 'loadById').mockResolvedValueOnce(null)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new StatementNotFound()))
  })
  test('Ensure UpdateStatementController calls loadPatrimonyById with patrimonies from delete and add arrays', async () => {
    const { sut, loadPatrimonyById } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimonyById, 'laodById')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    const { removedPatrimonies, addedPatrimonies } = request.body.statement
    expect(loadSpy).toHaveBeenNthCalledWith(1, removedPatrimonies[0])
    expect(loadSpy).toHaveBeenNthCalledWith(2, removedPatrimonies[1])
    expect(loadSpy).toHaveBeenNthCalledWith(3, addedPatrimonies[0])
    expect(loadSpy).toHaveBeenNthCalledWith(4, addedPatrimonies[1])
  })
  test('Ensure UpdateStatementController returns PatrimonyNotFound loadPatrimonyById returns null', async () => {
    const { sut, loadPatrimonyById } = makeSut()
    jest.spyOn(loadPatrimonyById, 'laodById').mockResolvedValueOnce(null)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    const { removedPatrimonies } = request.body.statement
    expect(response).toEqual(badRequest(new PatrimonyNotFound(removedPatrimonies[0])))
  })
  test('Ensure UpdateStatementController returns PatrimonyHasStatement on loadPatrimonyById returns patrimony with statemento code', async () => {
    const { sut, loadPatrimonyById } = makeSut()
    const patrimony = makeFakePatrimony()
    patrimony.statementCode = 'another_code'
    jest.spyOn(loadPatrimonyById, 'laodById').mockResolvedValueOnce(patrimony)
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(badRequest(new PatrimonyHasStatement(patrimony.code)))
  })
  test('Ensure UpdateStatementController calls updateStatementById with request body', async () => {
    const { sut, updateStatementById } = makeSut()
    const updateSpy = jest.spyOn(updateStatementById, 'updateById')
    const request = makeFakeHttpRequest()
    await sut.handle(request)
    expect(updateSpy).toHaveBeenCalledWith(request.body.statement)
  })
  test('Ensure UpdateStatementController returns server error if updateStatementById throws', async () => {
    const { sut, updateStatementById } = makeSut()
    jest.spyOn(updateStatementById, 'updateById').mockRejectedValueOnce(new Error())
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure UpdateStatementController returns noContent on success', async () => {
    const { sut } = makeSut()
    const request = makeFakeHttpRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(noContent())
  })
})
