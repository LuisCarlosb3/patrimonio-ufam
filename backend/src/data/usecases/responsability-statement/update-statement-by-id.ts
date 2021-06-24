import { DbUpdateStatementIdOnPatrimonyById } from '@/data/protocols/db/patrimony/db-update-patrimony-with-statement-id'
import { DbUpdateStatementById } from '@/data/protocols/db/responsability-statement/db-update-statement-by-id'
import { UpdateStatementById, UpdateStatementModel } from '@/domain/usecase/responsability-statement/update-statement-by-id'

export class UpdateStatementByIdData implements UpdateStatementById {
  constructor (
    private readonly updateStatement: DbUpdateStatementById,
    private readonly updatePatrimonyWithId: DbUpdateStatementIdOnPatrimonyById
  ) {}

  async updateById (statement: UpdateStatementModel): Promise<void> {
    const { addedPatrimonies, removedPatrimonies, ...statementData } = statement
    await this.updateStatement.updateById(statementData)
    if (addedPatrimonies.length > 0) {
      await this.updatePatrimonyWithId.updateStatement(addedPatrimonies, statementData.id)
    }
    if (removedPatrimonies.length > 0) {
      await this.updatePatrimonyWithId.updateStatement(removedPatrimonies, null)
    }
  }
}
