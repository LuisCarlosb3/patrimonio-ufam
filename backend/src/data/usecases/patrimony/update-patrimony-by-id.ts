import { DbCheckIfPatrimonyExists } from '@/data/protocols/db/patrimony/db-check-if-patrimony-exists-by-id'
import { DbDeletePatrimonyItenById } from '@/data/protocols/db/patrimony/db-delete-patrimony-itens-by-id'
import { DbInsertNewItensToPatrimony } from '@/data/protocols/db/patrimony/db-insert-new-itens-to-patrimony'
import { DbUpdatePatrimonyById } from '@/data/protocols/db/patrimony/db-update-patrimony-by-id'
import { Patrimony, PatrimonyItens } from '@/domain/model/patrimony'
import { UserPermission } from '@/domain/model/user'
import { NewItenToInsert, UpdatePatrimonyById, UpdatePatrimonyModel } from '@/domain/usecase/patrimony/update-patrimony-by-id'

export class UpdatePatrimonyByIdData implements UpdatePatrimonyById {
  constructor (
    private readonly verifyByIdRepository: DbCheckIfPatrimonyExists,
    private readonly updateByIdRepository: DbUpdatePatrimonyById,
    private readonly insertNewItens: DbInsertNewItensToPatrimony,
    private readonly dbDeleteItensById: DbDeletePatrimonyItenById
  ) {}

  async updateById (userPermission: UserPermission, patrimony: UpdatePatrimonyModel): Promise<boolean> {
    const exists = await this.verifyByIdRepository.verifyById(patrimony.id)
    if (exists) {
      const { deletedItens, ...payload } = patrimony
      const newItens: NewItenToInsert[] = payload.patrimonyItens.filter(item => {
        return (!item.id)
      })
      const updatedItens = payload.patrimonyItens.filter(item => {
        return (item.id)
      })
      const patrimonyToUpdate: Patrimony = {
        ...payload,
        patrimonyItens: updatedItens as PatrimonyItens[]
      }
      const updateSucceeds = await this.updateByIdRepository.updateById(patrimonyToUpdate)
      if (newItens.length > 0) {
        await this.insertNewItens.insertItens(patrimony.id, newItens)
      }
      if (deletedItens && deletedItens.length > 0) {
        await this.dbDeleteItensById.deleteById(deletedItens)
      }
      if (updateSucceeds === null) {
        return true
      }
    }
    return null
  }
}
