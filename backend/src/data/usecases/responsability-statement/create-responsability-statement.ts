import { DbCreateResponsabilityStatement, InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { CreateStatementModel, CreateResponsabilityStatement } from '@/domain/usecase/responsability-statement/create-responsability-statement'
import { DbLoadPatrimonyIdsByCodes } from '@/data/protocols/db/patrimony/db-load-patrimony-ids-by-codes'

export class CreateStatatementResponsabilityData implements CreateResponsabilityStatement {
  constructor (
    private readonly dbLoadCodes: DbLoadPatrimonyIdsByCodes,
    private readonly createStatement: DbCreateResponsabilityStatement
  ) {}

  async create (newStatement: CreateStatementModel): Promise<void> {
    const codes = newStatement.patrimoniesCode
    const ids = await this.dbLoadCodes.loadByCodes(codes)
    const newInsertModel: InsertNewStatementModel = {
      responsibleName: newStatement.responsibleName,
      siapeCode: newStatement.siapeCode,
      emissionDate: newStatement.emissionDate,
      patrimoniesIds: ids
    }
    await this.createStatement.create(newInsertModel)
  }
}
