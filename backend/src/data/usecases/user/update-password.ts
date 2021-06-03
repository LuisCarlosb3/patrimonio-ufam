import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbUpdateUserPasswordById } from '@/data/protocols/db/user/db-update-user-password-by-id'
import { UserUpdatePassword } from '@/domain/usecase/user/user-update-password'

export class UserUpdatePasswordData implements UserUpdatePassword {
  constructor (
    private readonly hasher: Hasher,
    private readonly dbUpdatePassword: DbUpdateUserPasswordById
  ) {}

  async updatePassword (userId: string, newPassword: string): Promise<void> {
    const hashPassword = await this.hasher.hash(newPassword)
    await this.dbUpdatePassword.updateById(userId, hashPassword)
  }
}
