import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface ListResponsabilityStatements {
  load(page?: number): Promise<ResponsabilityStatement[]>
}
