import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface LoadStatementByCodeOrSiape {
  loadByCodeOrSiape (filter: string, page?: number): Promise<ResponsabilityStatement[]>
}
