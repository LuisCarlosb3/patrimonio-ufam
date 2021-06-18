import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { UpdatePatrimonyById } from '@/domain/usecase/patrimony/update-patrimony-by-id'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class UpdatePatrimonyController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly loadUserById: LoadUserById,
    private readonly updatePatrimonyById: UpdatePatrimonyById,
    private readonly loadPatrimonyById: LoadPatrimonyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest.body)
      if (isValid) {
        return badRequest(isValid)
      }
      const { patrimony, accountId } = httpRequest.body

      const patrimonyLoaded = await this.loadPatrimonyById.laodById(patrimony.id)
      if (patrimonyLoaded) {
        const { permission } = await this.loadUserById.load(accountId)
        const isUpdate = await this.updatePatrimonyById.updateById(permission, patrimony)
        if (isUpdate) {
          return noContent()
        }
      }
      return badRequest(new PatrimonyNotFound())
    } catch (error) {
      return serverError(error)
    }
  }
}
