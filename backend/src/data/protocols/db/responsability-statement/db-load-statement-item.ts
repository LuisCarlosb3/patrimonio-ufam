import { StatementItem } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'

export interface DbLoadStatementItem {
  loadByPatrimonyId(patrimonyId: string): Promise<StatementItem>
}
