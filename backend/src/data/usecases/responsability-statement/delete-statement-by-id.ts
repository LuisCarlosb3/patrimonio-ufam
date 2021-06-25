import { DbLoadPatrimonyByStatementId } from '@/data/protocols/db/patrimony/db-load-patrimony-by-statement-id'
import { DbDeleteStatementById } from '@/data/protocols/db/responsability-statement/db-delete-statement-by-id'
import { UserPermission } from '@/domain/model/user'
import { DeleteStatementById } from '@/domain/usecase/responsability-statement/delete-statement-by-id'

export class DeleteStatementByIdData implements DeleteStatementById {
  constructor (
    private readonly deleteByIdRepository: DbDeleteStatementById,
    private readonly loadPatrimony: DbLoadPatrimonyByStatementId
  ) {}

  async deleteById (statementId: string, userPermission: UserPermission): Promise<boolean> {
    const patrimonies = await this.loadPatrimony.loadByStatementId(statementId)
    if (patrimonies.length === 0) {
      await this.deleteByIdRepository.deleteById(statementId)
      return true
    }
    return false
  }
}
