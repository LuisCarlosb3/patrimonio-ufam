import { DbCreateNewPatrimony } from '@/data/protocols/db/patrimony/db-create-new-patrimony'
import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { CreateNewPatrimony, NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'

export class CreateNewPatrimonyData implements CreateNewPatrimony {
  constructor (
    private readonly dbCheckCodeExists: DbCheckPatrimonyByCode,
    private readonly dbCreateNewPatrimony: DbCreateNewPatrimony
  ) {}

  async create (newPatrimony: NewPatrimonyModel): Promise<string> {
    const codeExists = await this.dbCheckCodeExists.checkByCode(newPatrimony.code)
    if (!codeExists) {
      const newPatrimonyId = await this.dbCreateNewPatrimony.create(newPatrimony)
      return newPatrimonyId || null
    }
    return null
  }
}
