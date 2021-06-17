import { DbLoadPatrimonyById } from '@/data/protocols/db/patrimony/db-load-patrimony-by-id'
import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { Patrimony } from '@/domain/model/patrimony'

export class LoadPatrimonyByIdData implements LoadPatrimonyById {
  constructor (
    private readonly loadById: DbLoadPatrimonyById
  ) {}

  async laodById (id: string): Promise<Patrimony> {
    const patrimony = await this.loadById.loadById(id)
    return patrimony || null
  }
}
