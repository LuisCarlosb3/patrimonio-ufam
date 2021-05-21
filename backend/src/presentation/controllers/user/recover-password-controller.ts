import SendRecoverPasswordEmail from '@/data/protocols/email/send-recover-password'
import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import { badRequest, noContent, serverError, unauthorizedRequest } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class RecoverPasswordController implements HttpController {
  constructor (
    private readonly dbRecoverUserPassword: UserRecoverPassword,
    private readonly validator: Validation,
    private readonly sendRecover: SendRecoverPasswordEmail
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validator.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { registration } = httpRequest.body
      const userRecover = await this.dbRecoverUserPassword.recover(registration)
      if (userRecover) {
        await this.sendRecover.sendRecover(userRecover.email, userRecover.hashlink)
        return noContent()
      }
      return unauthorizedRequest()
    } catch (error) {
      return serverError(error)
    }
  }
}
