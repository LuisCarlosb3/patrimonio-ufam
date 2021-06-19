import { DeletePatrimonyById } from '@/domain/usecase/patrimony/delete-patrimony-by-id'
import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, notFound, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class DeletePatrimonyByIdController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly loadPatrimony: LoadPatrimonyById,
    private readonly deletePatrimonyById: DeletePatrimonyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest.params)
      if (isValid) {
        return badRequest(isValid)
      }
      const { id } = httpRequest.params
      const patrimony = await this.loadPatrimony.laodById(id)
      if (patrimony) {
        await this.deletePatrimonyById.deletePatrimonyById(id)
        return noContent()
      } else {
        return notFound(new PatrimonyNotFound())
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
