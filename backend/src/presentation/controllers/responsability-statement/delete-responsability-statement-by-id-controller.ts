import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { StatementHasPatrimony } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'

export class DeleteResponsabilityStatementeByIdController implements HttpController {
  constructor (
    private readonly deleteStatementById: DeleteStatementById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const deleteSucceeds = await this.deleteStatementById.deleteById(params.id)
      if (deleteSucceeds) {
        return noContent()
      }
      return badRequest(new StatementHasPatrimony())
    } catch (error) {
      return serverError(error)
    }
  }
}
