import jwt from 'jsonwebtoken'
import JwtAdapter from '@/infra/jwt-adapter/jwt-adapter'
jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'token'
  },
  verify: jest.fn((first, second, callback) => callback())
}))
const secret = 'secret'
function makeSut (): JwtAdapter {
  return new JwtAdapter(secret)
}
function makeFakePayload (): { id: string, permission: number } {
  return { id: 'any_id', permission: 0 }
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
      expect(signSpy).toHaveBeenCalledWith('any_token', secret, expect.any(Function))
    })
  })
})
