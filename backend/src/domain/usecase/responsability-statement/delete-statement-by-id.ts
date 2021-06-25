import { UserPermission } from '@/domain/model/user'

export interface DeleteStatementById {
  deleteById(statementId: string, userPermission: UserPermission): Promise<boolean>
}
