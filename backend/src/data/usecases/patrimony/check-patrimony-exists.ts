import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { CheckPatrimonyCodeExists } from '@/domain/usecase/patrimony/check-patrimony-code-exists'

export class CheckPatrimonyExistsData implements CheckPatrimonyCodeExists {
  constructor (
    private readonly dbCheckByCode: DbCheckPatrimonyByCode
  ) {}

  async loadByCode (code: string): Promise<boolean> {
    const codeExists = await this.dbCheckByCode.checkByCode(code)
    return (codeExists !== null)
  }
}
