import { CreateNewUserData } from '@/data/usecases/user/admin-create-mew-user'
import { CreateNewUser } from '@/domain/usecase/user/create-user-by-admin'
import BcryptAdapter from '@/infra/bcrypt-adapter/bcrypt-adapter'
import { UserRepository } from '@/infra/db/repositories/user-repository'

export function makeCreateNewUser (): CreateNewUser {
  const dbLoadUserByEmail = new UserRepository()
  const hasher = new BcryptAdapter(12)
  const dbCreateNewUser = new UserRepository()
  const createUser = new CreateNewUserData(dbLoadUserByEmail, hasher, dbCreateNewUser)
  return createUser
}
