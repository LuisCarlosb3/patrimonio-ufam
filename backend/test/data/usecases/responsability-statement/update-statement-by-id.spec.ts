import { DbUpdateStatementById, DbUpdateStatementByIdModel } from '@/data/protocols/db/responsability-statement/db-update-statement-by-id'
import { UpdateStatementById, UpdateStatementModel } from '@/domain/usecase/responsability-statement/update-statement-by-id'
import { UpdateStatementByIdData } from '@/data/usecases/responsability-statement/update-statement-by-id'
import { DbUpdateStatementIdOnPatrimonyById } from '@/data/protocols/db/patrimony/db-update-patrimony-with-statement-id'
const makeResponsabilityStatement = (): UpdateStatementModel => {
  return {
    id: 'any_id',
    responsibleName: 'any_name',
    siapeCode: 'any_siape',
    emissionDate: new Date(),
    addedPatrimonies: [],
    removedPatrimonies: []
  }
}
function makeDbUpdateStatementById (): DbUpdateStatementById {
  class DbUpdateStatementByIdStub implements DbUpdateStatementById {
    async updateById (statement: DbUpdateStatementByIdModel): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbUpdateStatementByIdStub()
}
function makeDbUpdateStatementIdOnPatrimonyById (): DbUpdateStatementIdOnPatrimonyById {
  class DbUpdateStatementIdOnPatrimonyByIdStub implements DbUpdateStatementIdOnPatrimonyById {
    async updateStatement (patrimonyIds: string[], statementId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbUpdateStatementIdOnPatrimonyByIdStub()
}

interface Sut {
  sut: UpdateStatementById
  updateStatement: DbUpdateStatementById
  updatePatrimonyWithId: DbUpdateStatementIdOnPatrimonyById
}
const makeSut = (): Sut => {
  const updateStatement = makeDbUpdateStatementById()
  const updatePatrimonyWithId = makeDbUpdateStatementIdOnPatrimonyById()
  const sut = new UpdateStatementByIdData(updateStatement, updatePatrimonyWithId)
  return {
    sut,
    updateStatement,
    updatePatrimonyWithId
  }
}
describe('UpdateStatementByIdData', () => {
  test('Should call UpdateStatementById with statement to update', async () => {
    const { sut, updateStatement } = makeSut()
    const updateSpy = jest.spyOn(updateStatement, 'updateById')
    const statementToUpdate = makeResponsabilityStatement()
    await sut.updateById(statementToUpdate)
    const { addedPatrimonies, removedPatrimonies, ...data } = statementToUpdate
    expect(updateSpy).toHaveBeenCalledWith(data)
  })
  test('Should return null if UpdateStatementById returns void', async () => {
    const { sut } = makeSut()
    const statementToUpdate = makeResponsabilityStatement()
    const res = await sut.updateById(statementToUpdate)
    expect(res).toBeUndefined()
  })
  test('Should throws if updateById throws', async () => {
    const { sut, updateStatement } = makeSut()
    jest.spyOn(updateStatement, 'updateById').mockRejectedValueOnce(new Error())
    const statementToUpdate = makeResponsabilityStatement()
    const promise = sut.updateById(statementToUpdate)
    await expect(promise).rejects.toThrow()
  })
  test('Should call updatePatrimonyWithId with statement to update with statementId', async () => {
    const { sut, updatePatrimonyWithId } = makeSut()
    const updateSpy = jest.spyOn(updatePatrimonyWithId, 'updateStatement')
    const statementToUpdate = makeResponsabilityStatement()
    await sut.updateById(statementToUpdate)
    const { addedPatrimonies } = statementToUpdate
    expect(updateSpy).toHaveBeenNthCalledWith(1, addedPatrimonies, statementToUpdate.id)
  })
  test('Should call updatePatrimonyWithId with statement to update with no statementId', async () => {
    const { sut, updatePatrimonyWithId } = makeSut()
    const updateSpy = jest.spyOn(updatePatrimonyWithId, 'updateStatement')
    const statementToUpdate = makeResponsabilityStatement()
    await sut.updateById(statementToUpdate)
    const { removedPatrimonies } = statementToUpdate
    expect(updateSpy).toHaveBeenNthCalledWith(2, removedPatrimonies, null)
  })
  test('Should throws if updateStatement throws', async () => {
    const { sut, updatePatrimonyWithId } = makeSut()
    jest.spyOn(updatePatrimonyWithId, 'updateStatement').mockRejectedValueOnce(new Error())
    const statementToUpdate = makeResponsabilityStatement()
    const promise = sut.updateById(statementToUpdate)
    await expect(promise).rejects.toThrow()
  })
})
