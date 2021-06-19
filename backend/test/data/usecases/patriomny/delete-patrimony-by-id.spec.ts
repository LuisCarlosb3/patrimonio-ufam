import { DbDeletePatrimonyById } from '@/data/protocols/db/patrimony/db-delete-patrimony-by-id'
import { DeletePatrimonyById } from '@/domain/usecase/patrimony/delete-patrimony-by-id'
import { DeletePatrimonyByIdData } from '@/data/usecases/patrimony/delete-patrimony-by-id'
function makeDbLoadPatrimonyById (): DbDeletePatrimonyById {
  class DbDeletePatrimonyByIdStub implements DbDeletePatrimonyById {
    async deleteById (patrimonyId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbDeletePatrimonyByIdStub()
}
interface Sut {
  sut: DeletePatrimonyById
  deleteById: DbDeletePatrimonyById
}

const makeSut = (): Sut => {
  const deleteById = makeDbLoadPatrimonyById()
  const sut = new DeletePatrimonyByIdData(deleteById)
  return {
    sut,
    deleteById
  }
}

describe('DeletePatrimonyByIdData', () => {
  test('Should call deletePatrimonyById with patrimony id', async () => {
    const { sut, deleteById } = makeSut()
    const loadSpy = jest.spyOn(deleteById, 'deleteById')
    await sut.deletePatrimonyById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return null on success', async () => {
    const { sut, deleteById } = makeSut()
    jest.spyOn(deleteById, 'deleteById').mockResolvedValueOnce(null)
    const res = await sut.deletePatrimonyById('any_id')
    expect(res).toBeUndefined()
  })
  test('Should throws if updateById throws', async () => {
    const { sut, deleteById } = makeSut()
    jest.spyOn(deleteById, 'deleteById').mockRejectedValueOnce(new Error())
    const promise = sut.deletePatrimonyById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
