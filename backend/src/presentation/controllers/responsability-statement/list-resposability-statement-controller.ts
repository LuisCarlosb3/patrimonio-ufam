import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'

export class ListResponsabilityStatementController implements HttpController {
  constructor (
    private readonly loadResponsability: ListResponsabilityStatements
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const page = (params?.page && params?.page >= 0) ? params.page : 0
      const statementList = await this.loadResponsability.load(page)
      return responseSuccess({ statementList })
    } catch (error) {
      return serverError(error)
    }
  }
}
