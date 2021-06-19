import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { Patrimony } from '@/domain/model/patrimony'

export class LoadPatrimonyByCodeData implements LoadPatrimonyByCode {
  constructor (
    private readonly loadById: DbCheckPatrimonyByCode
  ) {}

  async loadByCode (code: string): Promise<Patrimony> {
    const patrimony = await this.loadById.checkByCode(code)
    return patrimony || null
  }
}
