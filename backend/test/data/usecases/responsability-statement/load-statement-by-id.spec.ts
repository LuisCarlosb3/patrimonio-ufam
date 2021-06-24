import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { DbLoadStatementById } from '@/data/protocols/db/responsability-statement/db-load-statement-by-id'
import { LoadStatementByIdData } from '@/data/usecases/responsability-statement/load-statement-by-id'
import Mockdate from 'mockdate'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
const makePatrimony = (): ResponsabilityStatement => {
  return {
    id: 'any_id',
    code: 'any_code',
    responsibleName: 'any_name',
    siapeCode: 'any_siape',
    emissionDate: new Date(),
    patrimonies: []
  }
}

const makeDbLoadStatementById = (): DbLoadStatementById => {
  class DbLoadStatementByIdStub implements DbLoadStatementById {
    async loadById (id: string): Promise<ResponsabilityStatement> {
      return await Promise.resolve(makePatrimony())
    }
  }
  return new DbLoadStatementByIdStub()
}

interface Sut {
  sut: LoadStatementById
  dbLoadStatement: DbLoadStatementById
}

const makeSut = (): Sut => {
  const dbLoadStatement = makeDbLoadStatementById()
  const sut = new LoadStatementByIdData(dbLoadStatement)
  return {
    sut,
    dbLoadStatement
  }
}

describe('LoadStatementByCodeOrSiapeData', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })
  afterAll(() => {
    Mockdate.reset()
  })
  test('Ensure LoadStatements calls load statement repository with id', async () => {
    const { sut, dbLoadStatement } = makeSut()
    const loadSpy = jest.spyOn(dbLoadStatement, 'loadById')
    await sut.loadById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('Ensure LoadStatements returns null if loadById returns null', async () => {
    const { sut, dbLoadStatement } = makeSut()
    jest.spyOn(dbLoadStatement, 'loadById').mockResolvedValueOnce(null)
    const patrimony = await sut.loadById('any_id')
    expect(patrimony).toBeNull()
  })
  test('Ensure LoadStatements returns an statement', async () => {
    const { sut } = makeSut()
    const list = await sut.loadById('any_id')
    expect(list).toEqual(makePatrimony())
  })
})
