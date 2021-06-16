import { DbCheckIfPatrimonyExists } from '@/data/protocols/db/patrimony/db-check-if-patrimony-exists-by-id'
import { DbUpdatePatrimonyById } from '@/data/protocols/db/patrimony/db-update-patrimony-by-id'
import { Patrimony } from '@/domain/model/patrimony'
import { UserPermission } from '@/domain/model/user'
import { UpdatePatrimonyById } from '@/domain/usecase/patrimony/update-patrimony-by-id'

export class UpdatePatrimonyByIdData implements UpdatePatrimonyById {
  constructor (
    private readonly verifyByIdRepository: DbCheckIfPatrimonyExists,
    private readonly updateByIdRepository: DbUpdatePatrimonyById
  ) {}

  async updateById (userPermission: UserPermission, patrimony: Patrimony): Promise<boolean> {
    const exists = await this.verifyByIdRepository.verifyById(patrimony.id)
    if (exists) {
      const updateSucceeds = await this.updateByIdRepository.updateById(patrimony)
      if (updateSucceeds === null) {
        return true
      }
    }
    return null
  }
}
