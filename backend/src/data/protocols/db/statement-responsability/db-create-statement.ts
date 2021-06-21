import { StatementResponsability } from '@/domain/model/statement-responsability'

export interface InsertNewStatementModel extends Omit<StatementResponsability, 'id' | 'patrimonies'>{
  patrimoniesIds: string[]
}

export interface DbCreateStatementResponsability {
  create (newStatement: InsertNewStatementModel): Promise<void>
}
