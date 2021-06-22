import { DbCreateResponsabilityStatement, InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { CreateStatementModel, CreateResponsabilityStatement } from '@/domain/usecase/responsability-statement/create-responsability-statement'
import { DbLoadPatrimonyIdsByCodes } from '@/data/protocols/db/patrimony/db-load-patrimony-ids-by-codes'
import { DbCheckIfCodeExists } from '@/data/protocols/db/responsability-statement/db-check-if-code-exists'

export class CreateStatatementResponsabilityData implements CreateResponsabilityStatement {
  constructor (
    private readonly dbLoadCodes: DbLoadPatrimonyIdsByCodes,
    private readonly createStatement: DbCreateResponsabilityStatement,
    private readonly codeExists: DbCheckIfCodeExists
  ) {}

  async create (newStatement: CreateStatementModel): Promise<void> {
    const codes = newStatement.patrimoniesCode
    const ids = await this.dbLoadCodes.loadByCodes(codes)
    let codeExists = true
    let code: string
    while (codeExists) {
      code = Math.random().toString(36).slice(2)
      codeExists = await this.codeExists.verifyCode(code)
    }
    const newInsertModel: InsertNewStatementModel = {
      responsibleName: newStatement.responsibleName,
      siapeCode: newStatement.siapeCode,
      emissionDate: newStatement.emissionDate,
      code,
      patrimoniesIds: ids
    }
    await this.createStatement.create(newInsertModel)
  }
}
