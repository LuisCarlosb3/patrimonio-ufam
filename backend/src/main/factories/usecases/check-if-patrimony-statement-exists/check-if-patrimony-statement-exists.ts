import { CheckIfPatrimonyStatementExistsData } from '@/data/usecases/responsability-statement/check-if-patrimony-statement-exists'
import { CheckIfPatrimonyStatementExists } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'

export function makeCheckIfPatrimonyStatementExists (): CheckIfPatrimonyStatementExists {
  const loadItem = new ResponsabilityStatementRespositoy()
  const check = new CheckIfPatrimonyStatementExistsData(loadItem)
  return check
}
