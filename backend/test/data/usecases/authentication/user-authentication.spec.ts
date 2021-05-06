import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { DbAuthentication } from '@/data/usecases/authentication/auth-authentication'
import { User, UserPermission } from '@/domain/model/user'
import { AuthenticationModel } from '@/domain/usecase/user/user-authentication'

const makeFakeUser = (): User => {
  return {
    id: 'any_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'any_password',
    permission: UserPermission.DEFAULT
  }
}
const makeFakeAuthenticationModel = (): AuthenticationModel => {
  return {
    registration: 'any_registration',
    password: 'any_password'
  }
}
const makeDbLoadAccountByRegistration = (): DbLoadAccountByRegistration => {
  class FakeDbLoadAccountByRegistration implements DbLoadAccountByRegistration {
    async loadByRegistration (registration: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }
  return new FakeDbLoadAccountByRegistration()
}

interface SutTypes {
  sut: DbAuthentication
  dbLoadAccountByRegistration: DbLoadAccountByRegistration
}

const makeSut = (): SutTypes => {
  const dbLoadAccountByRegistration = makeDbLoadAccountByRegistration()
  const sut = new DbAuthentication(dbLoadAccountByRegistration)
  return {
    sut,
    dbLoadAccountByRegistration
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByRegistration with correct registration', async () => {
    const { sut, dbLoadAccountByRegistration } = makeSut()
    const loadSpy = jest.spyOn(dbLoadAccountByRegistration, 'loadByRegistration')
    await sut.auth(makeFakeAuthenticationModel())
    expect(loadSpy).toHaveBeenCalledWith('any_registration')
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, dbLoadAccountByRegistration } = makeSut()
    jest.spyOn(dbLoadAccountByRegistration, 'loadByRegistration').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, dbLoadAccountByRegistration } = makeSut()
    jest.spyOn(dbLoadAccountByRegistration, 'loadByRegistration').mockReturnValueOnce(null)
    const result = await sut.auth(makeFakeAuthenticationModel())
    expect(result).toBeNull()
  })
})
