import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'
import { LoadStatementByCodeOrSiape } from '@/domain/usecase/responsability-statement/load-statement-by-code-or-siape'

export class ListResponsabilityStatementController implements HttpController {
  constructor (
    private readonly loadResponsability: ListResponsabilityStatements,
    private readonly loadResponsabilityWithFilter: LoadStatementByCodeOrSiape
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const page = (params?.page && params?.page >= 0) ? params.page : 0
      const filter = httpRequest.query?.filter
      const statementList = []
      if (filter) {
        const responseList = await this.loadResponsabilityWithFilter.loadByCodeOrSiape(filter, page)
        statementList.push(...responseList)
      } else {
        const responseList = await this.loadResponsability.load(page)
        statementList.push(...responseList)
      }
      return responseSuccess({ statementList })
    } catch (error) {
      return serverError(error)
    }
  }
}
