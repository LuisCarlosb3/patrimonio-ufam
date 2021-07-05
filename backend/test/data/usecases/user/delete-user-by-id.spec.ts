import { DbDeleteUserById } from '@/data/protocols/db/user/db-delete-user-by-id'
import { DeleteUserById } from '@/domain/usecase/user/delete-user-by-id'
import { DeleteUserByIdData } from '@/data/usecases/user/delete-user-by-id'

interface Sut {
  sut: DeleteUserById
  deleteUserById: DbDeleteUserById
}
const makeDbDeleteUserByIdStub = (): DbDeleteUserById => {
  class DbDeleteUserByIdStub implements DbDeleteUserById {
    async deleteById (userId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbDeleteUserByIdStub()
}
const makeSut = (): Sut => {
  const deleteUserById = makeDbDeleteUserByIdStub()
  const sut = new DeleteUserByIdData(deleteUserById)
  return {
    sut,
    deleteUserById
  }
}
describe('DeleteUserByIdData UseCase', () => {
  test('Should call DbLoadUserById with correct values', async () => {
    const { sut, deleteUserById } = makeSut()
    const loadSpy = jest.spyOn(deleteUserById, 'deleteById')
    await sut.deleteById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should throws if dbDeleteById throws', async () => {
    const { sut, deleteUserById } = makeSut()
    jest.spyOn(deleteUserById, 'deleteById').mockRejectedValueOnce(new Error())
    const promise = sut.deleteById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
