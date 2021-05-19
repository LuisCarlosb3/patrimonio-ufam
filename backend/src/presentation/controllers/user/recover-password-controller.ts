import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import { GenerateRecoverPasswordLink } from '@/presentation/protocols/generate-link-service'
import { serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'

export class RecoverPasswordController implements HttpController {
  constructor (
    private readonly generateRecoverLink: GenerateRecoverPasswordLink,
    private readonly dbRecoverUserPassword: UserRecoverPassword) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { registration } = httpRequest.body
      const recoverhash = await this.generateRecoverLink.generate(registration)
      await this.dbRecoverUserPassword.recover(registration, recoverhash)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
