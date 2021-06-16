import { Patrimony } from '@/domain/model/patrimony'
import { UserPermission } from '@/domain/model/user'

export interface UpdatePatrimonyById {
  updateById(userPermission: UserPermission, patrimony: Patrimony): Promise<boolean>
}
