import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
import { badRequest, noContent, notFound, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { Validation } from '@/presentation/protocols/validation'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { DeletePatrimonyByIdController } from '@/presentation/controllers/patrimony/delete-patrimony-by-id-controller'
import { DeletePatrimonyById } from '@/domain/usecase/patrimony/delete-patrimony-by-id'

const makeHttpRequest = (): HttpRequest => ({
  params: {
    id: 'id'
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
const makeLoadPatrimonyById = (): LoadPatrimonyById => {
  class LoadPatrimonyByIdStub implements LoadPatrimonyById {
    async laodById (id: string): Promise<Patrimony> {
      return await Promise.resolve(makePatrimony())
    }
  }
  return new LoadPatrimonyByIdStub()
}
function makeDeletePatrimonyById (): DeletePatrimonyById {
  class DeletePatrimonyByIdStub implements DeletePatrimonyById {
    async deletePatrimonyById (patrimonyId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DeletePatrimonyByIdStub()
}

interface Sut {
  sut: DeletePatrimonyByIdController
  validator: Validation
  loadPatrimony: LoadPatrimonyById
  deletePatrimonyById: DeletePatrimonyById
}

const makeSut = (): Sut => {
  const validator = makeFakeValidator()
  const loadPatrimony = makeLoadPatrimonyById()
  const deletePatrimonyById = makeDeletePatrimonyById()
  const sut = new DeletePatrimonyByIdController(validator, loadPatrimony, deletePatrimonyById)
  return {
    sut,
    validator,
    loadPatrimony,
    deletePatrimonyById
  }
}

describe('DeletePatrimonyByIdController', () => {
  test('Ensure DeletePatrimonyByIdController calls LoadPatrimonyById', async () => {
    const { sut, loadPatrimony } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimony, 'laodById')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(loadSpy).toHaveBeenCalledWith(request.params.id)
  })
  test('Ensure DeletePatrimonyByIdController returns noContent on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(noContent())
  })
  test('Ensure DeletePatrimonyByIdController returns 403 on patrimony not found', async () => {
    const { sut, loadPatrimony } = makeSut()
    jest.spyOn(loadPatrimony, 'laodById').mockResolvedValueOnce(null)
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(notFound(new PatrimonyNotFound()))
  })
  test('Ensure DeletePatrimonyByIdController returns 500 on throws', async () => {
    const { sut, loadPatrimony } = makeSut()
    jest.spyOn(loadPatrimony, 'laodById').mockRejectedValueOnce(new Error())
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })
  test('Ensure DeletePatrimonyByIdController calls validator with body data', async () => {
    const { sut, validator } = makeSut()
    const validateSpy = jest.spyOn(validator, 'validate')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.params)
  })
  test('Ensure DeletePatrimonyByIdController return badRequest on validator retruns an error', async () => {
    const { sut, validator } = makeSut()
    jest.spyOn(validator, 'validate').mockReturnValueOnce(new Error())
    const response = await sut.handle(makeHttpRequest())
    expect(response).toEqual(badRequest(new Error()))
  })
  test('Ensure DeletePatrimonyByIdController calls DeletePatrimonyById', async () => {
    const { sut, deletePatrimonyById } = makeSut()
    const deleteSpy = jest.spyOn(deletePatrimonyById, 'deletePatrimonyById')
    const request = makeHttpRequest()
    await sut.handle(request)
    expect(deleteSpy).toHaveBeenCalledWith(request.params.id)
  })
})
