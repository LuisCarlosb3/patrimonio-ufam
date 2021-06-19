import { DbDeletePatrimonyById } from '@/data/protocols/db/patrimony/db-delete-patrimony-by-id'
import { DeletePatrimonyById } from '@/domain/usecase/patrimony/delete-patrimony-by-id'

export class DeletePatrimonyByIdData implements DeletePatrimonyById {
  constructor (
    private readonly deleteById: DbDeletePatrimonyById
  ) {}

  async deletePatrimonyById (patrimonyId: string): Promise<void> {
    await this.deleteById.deleteById(patrimonyId)
  }
}
