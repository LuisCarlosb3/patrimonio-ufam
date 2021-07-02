import { DeleteStatementByIdData } from '@/data/usecases/responsability-statement/delete-statement-by-id'
import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'

export function makeDeleteStatementById (): DeleteStatementById {
  const statementsyRepository = new ResponsabilityStatementRespositoy()
  const patrimonyRepository = new PatrimonyRepository()
  const deleteStatementById = new DeleteStatementByIdData(statementsyRepository, patrimonyRepository)
  return deleteStatementById
}
