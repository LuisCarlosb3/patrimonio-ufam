import Decrypter from '@/data/protocols/criptography/decrypter'
import { LoadUserByTokenRepository } from '@/data/protocols/db/user/db-load-user-by-token'
import { User, UserPermission } from '@/domain/model/user'
import { LoadUserByTokenData } from '@/data/usecases/user/load-user-by-token'

interface Sut {
  sut: LoadUserByTokenData
  decrypterStub: Decrypter
  loadAccountByTokenRespositoryStub: LoadUserByTokenRepository
}
const makeFakeUser = (): User => ({
  id: 'any_id',
  name: 'any_name',
  registration: 'any_registration',
  email: 'any@email.com',
  password: 'hash_password',
  permission: UserPermission.INVENTORIOUS
})
const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise< { id: string, permission: number }> {
      return await new Promise(resolve => resolve({ id: 'any_token', permission: 0 }))
    }
  }
  return new DecrypterStub()
}
const makeLoadUserByTokenRepositoryStub = (): LoadUserByTokenRepository => {
  class LoadUserByTokenRepositoryStub implements LoadUserByTokenRepository {
    async loadByToken (token: string, permission: number): Promise<User> {
      return await new Promise(resolve => resolve(makeFakeUser()))
    }
  }
  return new LoadUserByTokenRepositoryStub()
}
const makeSut = (): Sut => {
  const loadAccountByTokenRespositoryStub = makeLoadUserByTokenRepositoryStub()
  const decrypterStub = makeDecrypterStub()
  const sut = new LoadUserByTokenData(decrypterStub, loadAccountByTokenRespositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRespositoryStub
  }
}
describe('DBLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', UserPermission.INVENTORIOUS)
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', UserPermission.INVENTORIOUS)
    expect(account).toBe(null)
  })
  test('Should call LoadAccountByTokenRespository with correct values', async () => {
    const { sut, loadAccountByTokenRespositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRespositoryStub, 'loadByToken')
    await sut.load('any_token', UserPermission.INVENTORIOUS)
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', UserPermission.INVENTORIOUS)
  })
  test('Should return null if LoadAccountByTokenRespository returns null', async () => {
    const { sut, loadAccountByTokenRespositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRespositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', UserPermission.INVENTORIOUS)
    expect(account).toBe(null)
  })
  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', UserPermission.INVENTORIOUS)
    expect(account).toEqual(makeFakeUser())
  })
  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promisse = sut.load('any_token', UserPermission.INVENTORIOUS)
    await expect(promisse).rejects.toThrow()
  })
  test('Should throw if LoadAccountByTokenRespositoryStub throws', async () => {
    const { sut, loadAccountByTokenRespositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRespositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promisse = sut.load('any_token', UserPermission.INVENTORIOUS)
    await expect(promisse).rejects.toThrow()
  })
})
