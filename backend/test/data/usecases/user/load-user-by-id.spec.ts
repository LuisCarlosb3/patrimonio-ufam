import { User, UserPermission } from '@/domain/model/user'
import { DbLoadUserById } from '@/data/protocols/db/user/db-load-user-by-id'
import { LoadUserByIdData } from '@/data/usecases/user/load-user-by-id'

interface Sut {
  sut: LoadUserByIdData
  loadUserById: DbLoadUserById
}
const makeFakeUser = (): User => ({
  id: 'any_id',
  name: 'any_name',
  registration: 'any_registration',
  email: 'any@email.com',
  password: 'hash_password',
  permission: UserPermission.INVENTORIOUS
})
const makeLoadUserByTokenRepositoryStub = (): DbLoadUserById => {
  class DbLoadUserByIdStub implements DbLoadUserById {
    async loadById (id: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }
  return new DbLoadUserByIdStub()
}
const makeSut = (): Sut => {
  const loadUserById = makeLoadUserByTokenRepositoryStub()
  const sut = new LoadUserByIdData(loadUserById)
  return {
    sut,
    loadUserById
  }
}
describe('DBLoadAccountByToken UseCase', () => {
  test('Should call DbLoadUserById with correct values', async () => {
    const { sut, loadUserById } = makeSut()
    const loadSpy = jest.spyOn(loadUserById, 'loadById')
    await sut.load('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('Should return null if DbLoadUserById returns null', async () => {
    const { sut, loadUserById } = makeSut()
    jest.spyOn(loadUserById, 'loadById').mockResolvedValueOnce(null)
    const account = await sut.load('any_id')
    expect(account).toBe(null)
  })
})
