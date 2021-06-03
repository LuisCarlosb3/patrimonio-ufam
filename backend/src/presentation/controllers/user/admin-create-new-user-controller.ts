import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'
import { badRequest, forbidden, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { CreateNewUser, CreateNewUserLink } from '@/domain/usecase/user/create-user-by-admin'
import { ValueInUseError } from '@/presentation/protocols/helpers/errors'
import SendNewUserAccessLink from '@/data/protocols/email/send-new-user-link'
export class AdminCreateNewUserController implements HttpController {
  constructor (
    private readonly newUserValidation: Validation,
    private readonly createNewUser: CreateNewUser,
    private readonly createNewUserLink: CreateNewUserLink,
    private readonly sendLink: SendNewUserAccessLink
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.newUserValidation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { name, registration, email, permission } = httpRequest.body
      const createResponse = await this.createNewUser.create({ name, registration, email, permission })
      if (Array.isArray(createResponse)) {
        return forbidden(new ValueInUseError(createResponse))
      }
      const accessLink = await this.createNewUserLink.create(createResponse.id)
      await this.sendLink.sendNewAccessLink(email, accessLink)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
