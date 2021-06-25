import { DbDeleteStatementById } from '@/data/protocols/db/responsability-statement/db-delete-statement-by-id'
import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { DeleteStatementByIdData } from '@/data/usecases/responsability-statement/delete-statement-by-id'
import { DbLoadPatrimonyByStatementId } from '@/data/protocols/db/patrimony/db-load-patrimony-by-statement-id'
import { Patrimony, PatrimonyState } from '@/domain/model/patrimony'
const makePatrimonyList = (): Patrimony[] => {
  const data = [
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
  ]
  return data
}
function makeDbDeleteStatementById (): DbDeleteStatementById {
  class DbDeleteStatementByIdStub implements DbDeleteStatementById {
    async deleteById (statementId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbDeleteStatementByIdStub()
}
function makeDbLoadPatrimonyByStatementId (): DbLoadPatrimonyByStatementId {
  class DbLoadPatrimonyByStatementIdStub implements DbLoadPatrimonyByStatementId {
    async loadByStatementId (statementId: string): Promise<Patrimony[]> {
      return await Promise.resolve([])
    }
  }
  return new DbLoadPatrimonyByStatementIdStub()
}
interface Sut {
  sut: DeleteStatementById
  deleteById: DbDeleteStatementById
  loadPatrimony: DbLoadPatrimonyByStatementId
}
const makeSut = (): Sut => {
  const deleteById = makeDbDeleteStatementById()
  const loadPatrimony = makeDbLoadPatrimonyByStatementId()
  const sut = new DeleteStatementByIdData(deleteById, loadPatrimony)
  return {
    sut,
    deleteById,
    loadPatrimony
  }
}

describe('DeleteStatementByIdData', () => {
  test('ensure deleteById calls dbDeleteById with statementId', async () => {
    const { sut, deleteById } = makeSut()
    const deleteSpy = jest.spyOn(deleteById, 'deleteById')
    await sut.deleteById('any_id')
    expect(deleteSpy).toHaveBeenCalledWith('any_id')
  })
  test('ensure deleteById calls loadPatrimony with statementId', async () => {
    const { sut, loadPatrimony } = makeSut()
    const loadSpy = jest.spyOn(loadPatrimony, 'loadByStatementId')
    await sut.deleteById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('ensure deleteById dont\'t calls dbDeleteById if loadPatrimony returns null', async () => {
    const { sut, deleteById, loadPatrimony } = makeSut()
    jest.spyOn(loadPatrimony, 'loadByStatementId').mockResolvedValueOnce(makePatrimonyList())
    const deleteSpy = jest.spyOn(deleteById, 'deleteById')
    await sut.deleteById('any_id')
    expect(deleteSpy).not.toHaveBeenCalled()
  })
  test('ensure deleteById returns true on success', async () => {
    const { sut } = makeSut()
    const isDeleted = await sut.deleteById('any_id')
    expect(isDeleted).toBeTruthy()
  })
  test('ensure deleteById returns false on fail', async () => {
    const { sut, loadPatrimony } = makeSut()
    jest.spyOn(loadPatrimony, 'loadByStatementId').mockResolvedValueOnce(makePatrimonyList())
    const isDeleted = await sut.deleteById('any_id')
    expect(isDeleted).toBeFalsy()
  })
})
