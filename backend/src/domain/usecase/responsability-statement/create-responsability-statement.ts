import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface CreateStatementModel extends Omit<ResponsabilityStatement, 'id' | 'patrimonies' | 'code'>{
  patrimoniesCode: string[]
}

export interface CreateResponsabilityStatement {
  create(newStatement: CreateStatementModel): Promise<void>
}
