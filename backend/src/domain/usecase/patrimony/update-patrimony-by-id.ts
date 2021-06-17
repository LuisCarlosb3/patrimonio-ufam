import { Patrimony, PatrimonyItens } from '@/domain/model/patrimony'
import { UserPermission } from '@/domain/model/user'

export interface UpdatePatrimonyModel extends Omit<Patrimony, 'patrimonyItens'> {
  patrimonyItens: Array<{
    id?: string
    name: string
    localization: string
    observation?: string
  }>
  deletedItens?: string[]
}
export interface NewItenToInsert extends Omit<PatrimonyItens, 'id'>{}
export interface UpdatePatrimonyById {
  updateById(userPermission: UserPermission, patrimony: UpdatePatrimonyModel): Promise<boolean>
}
