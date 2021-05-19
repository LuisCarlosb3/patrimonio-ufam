import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import { GenerateRecoverPasswordLink } from '@/presentation/protocols/generate-link-service'
import { badRequest, noContent, serverError, unauthorizedRequest } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class RecoverPasswordController implements HttpController {
  constructor (
    private readonly generateRecoverLink: GenerateRecoverPasswordLink,
    private readonly dbRecoverUserPassword: UserRecoverPassword,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validator.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { registration } = httpRequest.body
      const recoverhash = await this.generateRecoverLink.generate(registration)
      const userRecover = await this.dbRecoverUserPassword.recover(registration, recoverhash)
      if (userRecover) {
        return noContent()
      }
      return unauthorizedRequest()
    } catch (error) {
      return serverError(error)
    }
  }
}
