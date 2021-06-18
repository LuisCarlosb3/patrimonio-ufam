import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { DbLoadPatrimonyById } from '@/data/protocols/db/patrimony/db-load-patrimony-by-id'
import { Patrimony } from '@/domain/model/patrimony'
import { CheckPatrimonyIdAndCodeToUpdate } from '@/domain/usecase/patrimony/check-patrimony-id-and-code'
import { CodeAlreadyRegistered, PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'

export class CheckPatrimonyIdAndCodeToUpdateData implements CheckPatrimonyIdAndCodeToUpdate {
  constructor (
    private readonly loadPatrimonyById: DbLoadPatrimonyById,
    private readonly checkPatrimonyCode: DbCheckPatrimonyByCode
  ) {}

  async verifyPatrimony (id: string, code: string): Promise<Patrimony | Error> {
    const patrimony = await this.loadPatrimonyById.loadById(id)
    if (patrimony) {
      if (patrimony.code !== code) {
        const response = await this.checkPatrimonyCode.checkByCode(code)
        if (response) {
          return new CodeAlreadyRegistered()
        }
      }
      return patrimony
    }
    return new PatrimonyNotFound()
  }
}
