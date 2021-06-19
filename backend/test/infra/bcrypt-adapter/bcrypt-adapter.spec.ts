import BcryptAdapter from '@/infra/bcrypt-adapter/bcrypt-adapter'
import bcrypt from 'bcrypt'
const salt = 12
jest.mock('bcrypt', () => ({
  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  },
  async hash (): Promise<string> {
    return await Promise.resolve('any_hash')
  }
}))
function makeSut (): BcryptAdapter {
  return new BcryptAdapter(salt)
}

describe('Encrypter', () => {
  describe('Compare()', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('any_string', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_string', 'any_hash')
    })
    test('Should return true  when compare succeeds', async () => {
      const sut = makeSut()
      const response = await sut.compare('any_string', 'any_hash')
      expect(response).toBeTruthy()
    })
    test('Should return true  when compare succeeds', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)
      const response = await sut.compare('any_string', 'any_hash')
      expect(response).toBeFalsy()
    })
    test('Should throw if compare succeeds', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockRejectedValueOnce(new Error())
      const promise = sut.compare('any_string', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('Hasher()', () => {
    test('Should call hasher with correct values', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_string')
      expect(compareSpy).toHaveBeenCalledWith('any_string', salt)
    })
    test('Should return a hash on hasher succeds', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_string')
      expect(hash).toBe('any_hash')
    })
    test('Should throws if hasher throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
      const promise = sut.hash('any_string')
      await expect(promise).rejects.toThrow()
    })
  })
})
