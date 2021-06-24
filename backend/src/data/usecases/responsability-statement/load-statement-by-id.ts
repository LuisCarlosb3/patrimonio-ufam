import { DbLoadStatementById } from '@/data/protocols/db/responsability-statement/db-load-statement-by-id'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'

export class LoadStatementByIdData implements LoadStatementById {
  constructor (
    private readonly loadByIdRepository: DbLoadStatementById
  ) {}

  async loadById (id: string): Promise<ResponsabilityStatement> {
    const statement = await this.loadByIdRepository.loadById(id)
    return statement || null
  }
}
