import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface DbLoadResponsabilityStatementList {
  load(page: number, quantityPeerPage: number): Promise<ResponsabilityStatement[]>
}
export interface DbLoadResponsabilityStatementListFiltered {
  loadByCodeOrSiape(filter: string, page: number, quantityPeerPage: number): Promise<ResponsabilityStatement[]>
}
