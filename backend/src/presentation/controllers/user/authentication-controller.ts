import { UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { badRequest, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class AuthenticationController implements HttpController {
  constructor (
    private readonly userAuth: UserAuthentication,
    private readonly authValidator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { registration, password } = httpRequest.body
      const validationError = this.authValidator.validate({ registration, password })
      if (validationError) {
        return badRequest(validationError)
      }
      const token = await this.userAuth.auth({ registration, password })
      return responseSuccess({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
