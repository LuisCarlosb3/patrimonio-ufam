import { DeleteUserByIdData } from '@/data/usecases/user/delete-user-by-id'
import { DeleteUserById } from '@/domain/usecase/user/delete-user-by-id'
import { UserRepository } from '@/infra/db/repositories/user-repository'

export function makeDeleteUserById (): DeleteUserById {
  const userRepo = new UserRepository()
  const deleteUser = new DeleteUserByIdData(userRepo)
  return deleteUser
}
