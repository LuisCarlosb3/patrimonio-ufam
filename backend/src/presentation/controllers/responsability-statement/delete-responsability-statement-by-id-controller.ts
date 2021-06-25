import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { StatementHasPatrimony, StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'

export class DeleteResponsabilityStatementeByIdController implements HttpController {
  constructor (
    private readonly deleteStatementById: DeleteStatementById,
    private readonly loadStatementById: LoadStatementById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const statement = await this.loadStatementById.loadById(params.id)
      if (!statement) {
        return badRequest(new StatementNotFound())
      }
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
