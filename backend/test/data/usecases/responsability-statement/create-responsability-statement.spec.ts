import { DbCreateResponsabilityStatement, InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { CreateStatementModel, CreateResponsabilityStatement } from '@/domain/usecase/responsability-statement/create-responsability-statement'
import { CreateStatatementResponsabilityData } from '@/data/usecases/responsability-statement/create-responsability-statement'
import { DbLoadPatrimonyIdsByCodes } from '@/data/protocols/db/patrimony/db-load-patrimony-ids-by-codes'
import Mockdate from 'mockdate'
const mockRandomValue = 0.123456789
const mockStringRandomValue = mockRandomValue.toString(36).slice(2)
const makeCreateStatement = (): DbCreateResponsabilityStatement => {
  class DbCreateResponsabilityStatementStub implements DbCreateResponsabilityStatement {
    async create (newStatement: InsertNewStatementModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new DbCreateResponsabilityStatementStub()
}
const makeLoadCodes = (): DbLoadPatrimonyIdsByCodes => {
  class DbLoadPatrimonyIdsByCodesStub implements DbLoadPatrimonyIdsByCodes {
    async loadByCodes (codes: string[]): Promise<string[]> {
      return await Promise.resolve(['id1', 'id2'])
    }
  }
  return new DbLoadPatrimonyIdsByCodesStub()
}
const makeInsertStatementModel = (): InsertNewStatementModel => ({
  responsibleName: 'any_name',
  code: mockStringRandomValue,
  siapeCode: 'any_code',
  emissionDate: new Date(),
  patrimoniesIds: ['id1', 'id2']
})
const makeCreateStatementModel = (): CreateStatementModel => ({
  responsibleName: 'any_name',
  siapeCode: 'any_code',
  emissionDate: new Date(),
  patrimoniesCode: ['code1', 'code2']
})

interface Sut {
  sut: CreateResponsabilityStatement
  createStatement: DbCreateResponsabilityStatement
  dbLoadCodes: DbLoadPatrimonyIdsByCodes
}

const makeSut = (): Sut => {
  const createStatement = makeCreateStatement()
  const dbLoadCodes = makeLoadCodes()
  const sut = new CreateStatatementResponsabilityData(dbLoadCodes, createStatement)
  return {
    sut,
    createStatement,
    dbLoadCodes
  }
}
describe('CreateResponsabilityStatement', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
    jest.spyOn(global.Math, 'random').mockReturnValue(mockRandomValue)
  })
  afterAll(() => {
    Mockdate.reset()
    jest.spyOn(global.Math, 'random').mockRestore()
  })
  test('ensure create call loadIdsByCode with CreateStatementModel code list', async () => {
    const { sut, dbLoadCodes } = makeSut()
    const loadSpy = jest.spyOn(dbLoadCodes, 'loadByCodes')
    const model = makeCreateStatementModel()
    await sut.create(model)
    expect(loadSpy).toHaveBeenCalledWith(model.patrimoniesCode)
  })
  test('Should throws if dbLoadCodes throws', async () => {
    const { sut, dbLoadCodes } = makeSut()
    jest.spyOn(dbLoadCodes, 'loadByCodes').mockRejectedValueOnce(new Error())
    const model = makeCreateStatementModel()
    const promise = sut.create(model)
    await expect(promise).rejects.toThrow()
  })
  test('ensure create call createStatement with InsertNewStatementModel', async () => {
    const { sut, createStatement } = makeSut()
    const createSpy = jest.spyOn(createStatement, 'create')
    const model = makeCreateStatementModel()
    await sut.create(model)
    expect(createSpy).toHaveBeenCalledWith(makeInsertStatementModel())
  })
  test('Should throws if createStatement throws', async () => {
    const { sut, createStatement } = makeSut()
    jest.spyOn(createStatement, 'create').mockRejectedValueOnce(new Error())
    const model = makeCreateStatementModel()
    const promise = sut.create(model)
    await expect(promise).rejects.toThrow()
  })
  test('ensure return null on create succeeds', async () => {
    const { sut } = makeSut()
    const model = makeCreateStatementModel()
    const res = await sut.create(model)
    expect(res).toBeFalsy()
  })
})
