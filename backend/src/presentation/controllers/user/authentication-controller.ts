import { UserAuthentication } from '@/domain/usecase/user/user-authentication'
import { UnauthorizedError } from '@/presentation/protocols/helpers/errors'
import { badRequest, forbidden, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
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
      const authRespnse = await this.userAuth.auth({ registration, password })
      if (authRespnse) {
        return responseSuccess({ ...authRespnse })
      } else {
        return forbidden(new UnauthorizedError())
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
