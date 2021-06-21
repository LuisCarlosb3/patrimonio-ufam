import { StatementResponsability } from '@/domain/model/statement-responsability'

export interface CreateStatementModel extends Omit<StatementResponsability, 'id' | 'patrimonies'>{
  patrimoniesCode: string[]
}

export interface CreateStatementResponsability {
  create(newStatement: CreateStatementModel): Promise<void>
}
