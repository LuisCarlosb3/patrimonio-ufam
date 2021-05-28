import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'
import { UserUpdatePassword } from '@/domain/usecase/user/user-update-password'
import { badRequest, noContent, serverError, unauthorizedRequest } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class UpdatePasswordController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly verifyLink: CheckUserRecoverLink,
    private readonly updatePassword: UserUpdatePassword
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params, body } = httpRequest
      const hasError = this.validator.validate({ ...params, ...body })
      if (hasError) {
        return badRequest(hasError)
      }
      const userId = await this.verifyLink.verify(params.link)
      if (userId) {
        await this.updatePassword.updatePassword(userId, body.password)
        return noContent()
      }
      return unauthorizedRequest()
    } catch (error) {
      return serverError(error)
    }
  }
}
