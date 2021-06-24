import { UpdateStatementByIdData } from '@/data/usecases/responsability-statement/update-statement-by-id'
import { UpdateStatementById } from '@/domain/usecase/responsability-statement/update-statement-by-id'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'

export function makeUpdateStatementById (): UpdateStatementById {
  const updateStatement = new ResponsabilityStatementRespositoy()
  const updatePatrimonyWithId = new PatrimonyRepository()
  const update = new UpdateStatementByIdData(updateStatement, updatePatrimonyWithId)
  return update
}
