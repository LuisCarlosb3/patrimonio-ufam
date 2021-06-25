import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { StatementHasPatrimony, StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class DeleteResponsabilityStatementeByIdController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly deleteStatementById: DeleteStatementById,
    private readonly loadStatementById: LoadStatementById,
    private readonly loadUserById: LoadUserById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const validationErr = this.validator.validate({ ...params, ...httpRequest.body })
      if (validationErr) {
        return badRequest(validationErr)
      }
      const { accountId } = httpRequest.body

      const statement = await this.loadStatementById.loadById(params.id)
      if (!statement) {
        return badRequest(new StatementNotFound())
      }
      const { permission } = await this.loadUserById.load(accountId)
      const deleteSucceeds = await this.deleteStatementById.deleteById(params.id, permission)
      if (deleteSucceeds) {
        return noContent()
      }
      return badRequest(new StatementHasPatrimony())
    } catch (error) {
      return serverError(error)
    }
  }
}
