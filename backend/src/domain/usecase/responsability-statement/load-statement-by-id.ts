import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface LoadStatementById{
  loadById (id: string): Promise<ResponsabilityStatement>
}
