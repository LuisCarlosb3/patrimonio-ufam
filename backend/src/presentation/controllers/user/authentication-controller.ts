import { UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'

export class AuthenticationController implements HttpController {
  constructor (
    private readonly userAuth: UserAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { registration, password } = httpRequest.body
      const token = await this.userAuth.auth({ registration, password })
      return responseSuccess({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
