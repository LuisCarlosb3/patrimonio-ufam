import { CreateStatatementResponsabilityData } from '@/data/usecases/responsability-statement/create-responsability-statement'
import { CreateResponsabilityStatement } from '@/domain/usecase/responsability-statement/create-responsability-statement'
import { ResponsabilityStatementRespositoy } from '@/infra/db/repositories/responsability_statement'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeCreateResponsabilityStatement (): CreateResponsabilityStatement {
  const dbLoadCodes = new PatrimonyRepository()
  const createStatement = new ResponsabilityStatementRespositoy()
  const codeExists = new ResponsabilityStatementRespositoy()
  const create = new CreateStatatementResponsabilityData(dbLoadCodes, createStatement, codeExists)
  return create
}
