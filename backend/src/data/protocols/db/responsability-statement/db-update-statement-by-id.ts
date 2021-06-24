import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
export interface DbUpdateStatementByIdModel extends Omit<ResponsabilityStatement, 'code' | 'patrimonies'>{}
export interface DbUpdateStatementById {
  updateById(statement: DbUpdateStatementByIdModel): Promise<void>
}
