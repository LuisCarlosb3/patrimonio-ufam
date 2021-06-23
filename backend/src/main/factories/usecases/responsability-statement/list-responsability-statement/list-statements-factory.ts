import { ListResponsabilityStatementsData } from '@/data/usecases/responsability-statement/list-responsability-statements'
import { ListResponsabilityStatements } from '@/domain/usecase/responsability-statement/list-responsability-statement'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'

export function makeListResponsabilityStatementData (): ListResponsabilityStatements {
  const statementsyRepository = new ResponsabilityStatementRespositoy()
  const loadStatementsListData = new ListResponsabilityStatementsData(statementsyRepository)
  return loadStatementsListData
}
