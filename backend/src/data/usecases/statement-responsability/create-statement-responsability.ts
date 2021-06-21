import { DbLoadPatrimonyIdsByCodes } from '@/data/protocols/db/patrimony/db-load-patrimony-ids-by-codes'
import { DbCreateStatementResponsability, InsertNewStatementModel } from '@/data/protocols/db/statement-responsability/db-create-statement'
import { CreateStatementModel, CreateStatementResponsability } from '@/domain/usecase/statement-responsability/create-statement-responsability'

export class CreateStatatementResponsabilityData implements CreateStatementResponsability {
  constructor (
    private readonly dbLoadCodes: DbLoadPatrimonyIdsByCodes,
    private readonly createStatement: DbCreateStatementResponsability
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
