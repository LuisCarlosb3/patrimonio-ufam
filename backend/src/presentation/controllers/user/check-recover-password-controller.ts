import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'
import { badRequest, noContent, serverError, unauthorizedRequest } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class CheckRecoverLinkController implements HttpController {
  constructor (
    private readonly checkUserByLink: CheckUserRecoverLink,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { params } = httpRequest
      const validateResponse = this.validation.validate(params)
      if (validateResponse) {
        return badRequest(validateResponse)
      }
      const userId = await this.checkUserByLink.verify(params.link)
      if (userId) {
        return noContent()
      }
      return unauthorizedRequest()
    } catch (error) {
      return serverError(error)
    }
  }
}
