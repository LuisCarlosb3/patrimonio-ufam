import { User, UserPermission } from '@/domain/model/user'
import { LoadUserByToken } from '@/domain/usecase/user/load-user-by-token'
import { AccessDeniedError } from '@/presentation/protocols/helpers/errors'
import { forbidden, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest } from '@/presentation/protocols/http'
import { AuthMiddleware } from '@/presentation/middleware/authentication-middleware/auth-middleware'

const makeFakeAccount = (): User => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
  permission: UserPermission.ADMINISTRATOR,
  registration: 'valid_registration'
})
const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any-token'
  }
})
interface Sut {
  sut: AuthMiddleware
  loadUserByTokenStub: LoadUserByToken
}
const makeLoadAccountByToken = (): LoadUserByToken => {
  class LoadUserByTokenStub implements LoadUserByToken {
    async load (accessToken: string, permission?: UserPermission): Promise<User> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadUserByTokenStub()
}
const makeSut = (role?: number): Sut => {
  const loadUserByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadUserByTokenStub, role)
  return {
    sut,
    loadUserByTokenStub
  }
}
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token existis in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return call loadUserByToken with correct accessToken', async () => {
    const role = UserPermission.INVENTORIOUS
    const { sut, loadUserByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadUserByTokenStub, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any-token', role)
  })
  test('Should return 403 if no loadUserByToken returns null', async () => {
    const { sut, loadUserByTokenStub } = makeSut()
    jest.spyOn(loadUserByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should return 200 if no loadUserByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(responseSuccess({ accountId: 'valid_id' }))
  })
  test('Should return 500 if no loadUserByToken throws', async () => {
    const { sut, loadUserByTokenStub } = makeSut()
    jest.spyOn(loadUserByTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
