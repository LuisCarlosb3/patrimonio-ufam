import jwt from 'jsonwebtoken'
import JwtAdapter from './jwt-adapter'
jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('token')
  },
  async verify (): Promise<any> {
    return await Promise.resolve({ id: 'id', permission: 'ANY_PERMISSION', line: ['any_line'] })
  }
}))
const secret = 'secret'
function makeSut (): JwtAdapter {
  return new JwtAdapter(secret)
}
function makeFakePayload (): { id: string, permission: string, line: string[] } {
  return { id: 'any_id', permission: 'any_permission', line: ['any_line'] }
}
describe('JWT Adapter', () => {
  describe('Encrypt', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt(makeFakePayload())
      expect(signSpy).toHaveBeenCalledWith(makeFakePayload(), secret)
    })
    test('Should return a token generate by sign', async () => {
      const sut = makeSut()
      const token = await sut.encrypt(makeFakePayload())
      expect(token).toBe('token')
    })
    test('Should throw if Jwt throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt(makeFakePayload())
      await expect(promise).rejects.toThrow()
    })
  })
  describe('Decrypt', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(signSpy).toHaveBeenCalledWith('any_token', secret)
    })
    test('Should return a payload decrypted', async () => {
      const sut = makeSut()
      const response = await sut.decrypt('any_token')
      expect(response).toEqual({ id: 'id', permission: 'ANY_PERMISSION', line: ['any_line'] })
    })
    test('Should throw if Jwt throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
