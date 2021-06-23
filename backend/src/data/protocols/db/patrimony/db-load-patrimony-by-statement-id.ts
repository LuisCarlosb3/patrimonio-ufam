import { Patrimony } from '@/domain/model/patrimony'

export interface DbLoadPatrimonyByStatementId{
  loadByStatementId(statementId: string): Promise<Patrimony[]>
}
