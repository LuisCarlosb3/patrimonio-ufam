import { HashComparer } from '@/data/protocols/criptography/hash-compare'
import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { AuthenticationData } from '@/data/usecases/user/auth-authentication'
import { User, UserPermission } from '@/domain/model/user'
import { AuthenticationModel } from '@/domain/usecase/user/user-authentication'
import Encrypter from '@/data/protocols/criptography/encrypter'

const makeFakeUser = (): User => {
  return {
    id: 'any_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'hash_password',
    permission: UserPermission.INVENTORIOUS
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
const makeHashCompareStub = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<Boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (payload: { id: string, permission: number }): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: AuthenticationData
  dbLoadAccountByRegistration: DbLoadAccountByRegistration
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const dbLoadAccountByRegistration = makeDbLoadAccountByRegistration()
  const hashComparerStub = makeHashCompareStub()
  const encrypterStub = makeEncrypter()
  const sut = new AuthenticationData(dbLoadAccountByRegistration, hashComparerStub, encrypterStub)
  return {
    sut,
    dbLoadAccountByRegistration,
    hashComparerStub,
    encrypterStub
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
  test('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hash_password')
  })
  test('Should throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if HashCompare return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const token = await sut.auth(makeFakeAuthenticationModel())
    expect(token).toBeNull()
  })
  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const { id, permission } = makeFakeUser()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationModel())
    expect(encryptSpy).toHaveBeenCalledWith({ id, permission })
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationModel())
    await expect(promise).rejects.toThrow()
  })
  test('Should return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationModel())
    expect(accessToken.token).toBe('any_token')
    expect(accessToken.userData.email).toBe('any@email.com')
  })
})
