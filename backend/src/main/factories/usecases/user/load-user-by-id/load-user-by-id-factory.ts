import { LoadUserByIdData } from '@/data/usecases/user/load-user-by-id'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { UserRepository } from '@/infra/db/repositories/user-repository'

export function makeLoadUserById (): LoadUserById {
  const loadUserByIdRepository = new UserRepository()
  const loadUserById = new LoadUserByIdData(loadUserByIdRepository)
  return loadUserById
}
