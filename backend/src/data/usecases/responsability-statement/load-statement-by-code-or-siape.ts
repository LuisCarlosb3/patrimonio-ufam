import { DbLoadResponsabilityStatementListFiltered } from '@/data/protocols/db/responsability-statement/db-load-statements-list'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { LoadStatementByCodeOrSiape } from '@/domain/usecase/responsability-statement/load-statement-by-code-or-siape'

export class LoadStatementByCodeOrSiapeData implements LoadStatementByCodeOrSiape {
  constructor (
    private readonly load: DbLoadResponsabilityStatementListFiltered
  ) {}

  async loadByCodeOrSiape (filter: string, page?: number): Promise<ResponsabilityStatement[]> {
    const quantityPeerPage = 10
    const pageToQuery = (page && page > 0) ? ((page - 1) * quantityPeerPage) : 0
    const patrimonyList = await this.load.loadByCodeOrSiape(filter, pageToQuery, quantityPeerPage)
    return patrimonyList
  }
}
