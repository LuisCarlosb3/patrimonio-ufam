import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, notFound, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class GetStatementByCodeController implements HttpController {
  constructor (
    private readonly loadStatement: LoadStatementById,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest.params)
      if (isValid) {
        return badRequest(isValid)
      }
      const { id } = httpRequest.params
      const statement = await this.loadStatement.loadById(id)
      if (statement) {
        return responseSuccess({ statement })
      } else {
        return notFound(new StatementNotFound())
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
