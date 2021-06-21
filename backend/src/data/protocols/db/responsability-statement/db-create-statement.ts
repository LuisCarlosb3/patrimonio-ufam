import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface InsertNewStatementModel extends Omit<ResponsabilityStatement, 'id' | 'patrimonies'>{
  patrimoniesIds: string[]
}

export interface DbCreateResponsabilityStatement{
  create (newStatement: InsertNewStatementModel): Promise<void>
}
