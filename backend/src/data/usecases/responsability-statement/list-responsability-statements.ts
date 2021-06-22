import { DbLoadResponsabilityStatementList } from '@/data/protocols/db/responsability-statement/db-load-statements-list'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'

export class ListResponsabilityStatementsData implements ListResponsabilityStatements {
  constructor (
    private readonly loadStatement: DbLoadResponsabilityStatementList
  ) {}

  async load (page?: number): Promise<ResponsabilityStatement[]> {
    const quantityPeerPage = 10
    const pageToQuery = (page && page > 0) ? ((page - 1) * quantityPeerPage) : 0
    const patrimonyList = await this.loadStatement.load(pageToQuery, quantityPeerPage)
    return patrimonyList
  }
}
