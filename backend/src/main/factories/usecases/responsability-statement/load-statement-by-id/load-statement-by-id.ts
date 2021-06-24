import { LoadStatementByIdData } from '@/data/usecases/responsability-statement/load-statement-by-id'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'

export function makeLoadStatementById (): LoadStatementById {
  const repository = new ResponsabilityStatementRespositoy()
  const load = new LoadStatementByIdData(repository)
  return load
}
