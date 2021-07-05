import { DbDeleteUserById } from '@/data/protocols/db/user/db-delete-user-by-id'
import { DeleteUserById } from '@/domain/usecase/user/delete-user-by-id'

export class DeleteUserByIdData implements DeleteUserById {
  constructor (
    private readonly deleteUserRepository: DbDeleteUserById
  ) {}

  async deleteById (userId: string): Promise<void> {
    await this.deleteUserRepository.deleteById(userId)
  }
}
