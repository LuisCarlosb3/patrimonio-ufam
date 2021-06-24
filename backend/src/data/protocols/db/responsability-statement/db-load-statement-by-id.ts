import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface DbLoadStatementById{
  loadById (id: string): Promise<ResponsabilityStatement>
}
