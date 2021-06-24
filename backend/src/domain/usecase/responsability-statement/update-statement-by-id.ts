import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface UpdateStatementModel extends Omit<ResponsabilityStatement, 'code' | 'patrimonies'>{
  removedPatrimonies: string[]
  addedPatrimonies: string[]
}

export interface UpdateStatementById {
  updateById(statement: UpdateStatementModel): Promise<void>
}
