import { LoadStatementByCodeOrSiapeData } from '@/data/usecases/responsability-statement/load-statement-by-code-or-siape'
import { LoadStatementByCodeOrSiape } from '@/domain/usecase/responsability-statement/load-statement-by-code-or-siape'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'

export function makeLoadStatementByCodeOrSiape (): LoadStatementByCodeOrSiape {
  const repository = new ResponsabilityStatementRespositoy()
  const load = new LoadStatementByCodeOrSiapeData(repository)
  return load
}
