import { UserUpdatePasswordData } from '@/data/usecases/user/update-password'
import { UserUpdatePassword } from '@/domain/usecase/user/user-update-password'
import BcryptAdapter from '@/infra/bcrypt-adapter/bcrypt-adapter'
import { UserRepository } from '@/infra/db/repositories/user-repository'

export function makeUpdatePasswordData (): UserUpdatePassword {
  const hasher = new BcryptAdapter(12)
  const dbUpdatePassword = new UserRepository()
  return new UserUpdatePasswordData(hasher, dbUpdatePassword)
}
