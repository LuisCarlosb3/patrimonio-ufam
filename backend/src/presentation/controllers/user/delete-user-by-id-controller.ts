import { DeleteUserById } from '@/domain/usecase/user/delete-user-by-id'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class DeleteUserByIdController implements HttpController {
  constructor (
    private readonly deleteUserById: DeleteUserById,
    private readonly validator: Validation,
    private readonly loadUserById: LoadUserById

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validator.validate(httpRequest.params)
      if (validationError) {
        return badRequest(validationError)
      }
      const { id } = httpRequest.params
      const { accountId } = httpRequest.body
      const user = await this.loadUserById.load(id)
      if (user) {
        if (id !== accountId) {
          await this.deleteUserById.deleteById(id)
          return noContent()
        }
        return badRequest(new Error('You cannot delete your account'))
      }
      return badRequest(new Error('User not found'))
    } catch (error) {
      return serverError(error)
    }
  }
}
