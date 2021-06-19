import { LoadUserByToken } from '@/domain/usecase/user/load-user-by-token'
import { AccessDeniedError } from '@/presentation/protocols/helpers/errors'
import { forbidden, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { Middleware } from '@/presentation/protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByToken: LoadUserByToken,
    private readonly role?: number
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadUserByToken.load(accessToken, this.role)
        if (account) {
          return responseSuccess({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
