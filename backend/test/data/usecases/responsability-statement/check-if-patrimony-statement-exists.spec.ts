import { CheckIfPatrimonyStatementExists, StatementItem } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'
import { CheckIfPatrimonyStatementExistsData } from '@/data/usecases/responsability-statement/check-if-patrimony-statement-exists'
import { DbLoadStatementItem } from '@/data/protocols/db/responsability-statement/db-load-statement-item'
function makeStatementItem (): StatementItem {
  return {
    patrimonyId: 'any_id',
    responsabilityStatementId: 'any_id'
  }
}

function makeLoadStatementItem (): DbLoadStatementItem {
  class DbLoadStatementItemStub implements DbLoadStatementItem {
    async loadByPatrimonyId (patrimonyId: string): Promise<StatementItem> {
      return await Promise.resolve(makeStatementItem())
    }
  }
  return new DbLoadStatementItemStub()
}
interface Sut {
  sut: CheckIfPatrimonyStatementExists
  loadStatementItem: DbLoadStatementItem
}
const makeSut = (): Sut => {
  const loadStatementItem = makeLoadStatementItem()
  const sut = new CheckIfPatrimonyStatementExistsData(loadStatementItem)
  return {
    sut,
    loadStatementItem
  }
}
describe('CheckIfPatrimonyStatementExists', () => {
  test('Ensure loadStatement calls local statement by patrimony id', async () => {
    const { sut, loadStatementItem } = makeSut()
    const loadSpy = jest.spyOn(loadStatementItem, 'loadByPatrimonyId')
    await sut.loadStatement('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('Ensure loadStatement returns statement item on success', async () => {
    const { sut } = makeSut()
    const item = await sut.loadStatement('any_id')
    expect(item).toEqual(makeStatementItem())
  })
  test('Ensure loadStatement returns null if item not exists ', async () => {
    const { sut, loadStatementItem } = makeSut()
    jest.spyOn(loadStatementItem, 'loadByPatrimonyId').mockResolvedValueOnce(null)
    const item = await sut.loadStatement('any_id')
    expect(item).toBeNull()
  })
})
