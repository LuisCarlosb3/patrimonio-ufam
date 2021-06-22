import { DbLoadStatementItem } from '@/data/protocols/db/responsability-statement/db-load-statement-item'
import { CheckIfPatrimonyStatementExists, PatrimonyStatementItem } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'

export class CheckIfPatrimonyStatementExistsData implements CheckIfPatrimonyStatementExists {
  constructor (
    private readonly loadStatementItem: DbLoadStatementItem
  ) {}

  async loadStatement (patrimonyId: string): Promise<PatrimonyStatementItem> {
    const item = await this.loadStatementItem.loadByPatrimonyId(patrimonyId)
    return item || null
  }
}
