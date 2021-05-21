import { DbLoadAccountByRegistration } from '@/data/protocols/db/db-load-account-by-registration'
import { User, UserPermission } from '@/domain/model/user'
import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import { RecoverPasswordData } from '@/data/usecases/user/recover-password'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbUpdateUserRecoverLink } from '@/data/protocols/db/user-recover-password/db-update-user-recover-password'

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
const makeDbLoadAccountByRegistration = (): DbLoadAccountByRegistration => {
  class FakeDbLoadAccountByRegistration implements DbLoadAccountByRegistration {
    async loadByRegistration (registration: string): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }
  return new FakeDbLoadAccountByRegistration()
}
const makeHashCompareStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hash_link'))
    }
  }
  return new HasherStub()
}
const makeUpdateUserRegistration = (): DbUpdateUserRecoverLink => {
  class DbUpdateUserRecoverLinkStub implements DbUpdateUserRecoverLink {
    async update (id: string, link: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new DbUpdateUserRecoverLinkStub()
}
interface Sut {
  sut: UserRecoverPassword
  hasherStub: Hasher
  dbLoadAccountByRegistration: DbLoadAccountByRegistration
  dbUpdateUserRegistration: DbUpdateUserRecoverLink
}
const makeSut = (): Sut => {
  const dbLoadAccountByRegistration = makeDbLoadAccountByRegistration()
  const hasherStub = makeHashCompareStub()
  const dbUpdateUserRegistration = makeUpdateUserRegistration()
  const sut = new RecoverPasswordData(dbLoadAccountByRegistration, hasherStub, dbUpdateUserRegistration)
  return {
    sut,
    dbLoadAccountByRegistration,
    hasherStub,
    dbUpdateUserRegistration
  }
}

describe('RecoverPasswordData', () => {
  test('Ensure RecoverPasswordData calls loadUserByRegistration with user registration', async () => {
    const { sut, dbLoadAccountByRegistration } = makeSut()
    const loadSpy = jest.spyOn(dbLoadAccountByRegistration, 'loadByRegistration')
    await sut.recover('any_registration')
    expect(loadSpy).toHaveBeenCalledWith('any_registration')
  })
  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, dbLoadAccountByRegistration } = makeSut()
    jest.spyOn(dbLoadAccountByRegistration, 'loadByRegistration').mockRejectedValueOnce(new Error())
    const promise = sut.recover('any_registration')
    await expect(promise).rejects.toThrow()
  })
  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, dbLoadAccountByRegistration } = makeSut()
    jest.spyOn(dbLoadAccountByRegistration, 'loadByRegistration').mockReturnValueOnce(null)
    const result = await sut.recover('any_registration')
    expect(result).toBeNull()
  })
  test('Should call HashCompare with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const compareSpy = jest.spyOn(hasherStub, 'hash')
    await sut.recover('any_registration')
    expect(compareSpy).toHaveBeenCalledWith('any_registration')
  })
  test('Should throw if HashCompare throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.recover('any_registration')
    await expect(promise).rejects.toThrow()
  })
  test('Ensure RecoverPasswordData calls dbUpdateUserRegistration', async () => {
    const { sut, dbUpdateUserRegistration } = makeSut()
    const loadSpy = jest.spyOn(dbUpdateUserRegistration, 'update')
    await sut.recover('any_registration')
    expect(loadSpy).toHaveBeenCalledWith('any_id', 'hash_link')
  })
  test('Should return recover link if RecoverPasswordData', async () => {
    const { sut } = makeSut()
    const link = await sut.recover('any_registration')
    expect(link).toEqual({ email: 'any@email.com', hashlink: 'hash_link' })
  })
})
