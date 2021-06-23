import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { CreateNewUser } from '@/domain/usecase/user/create-user-by-admin'
import { ValueInUseError } from '@/presentation/protocols/helpers/errors'
import SendNewUserAccessLink from '@/data/protocols/email/send-new-user-link'
export class AdminCreateNewUserController implements HttpController {
  constructor (
    private readonly newUserValidation: Validation,
    private readonly createNewUser: CreateNewUser,
    private readonly sendLink: SendNewUserAccessLink
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.newUserValidation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, registration, email, permission, password } = httpRequest.body
      const createResponse = await this.createNewUser.create({ name, registration, email, permission, password })
      if (Array.isArray(createResponse)) {
        return badRequest(new ValueInUseError(createResponse))
      }
      await this.sendLink.sendNewNewUserNotify(email)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
