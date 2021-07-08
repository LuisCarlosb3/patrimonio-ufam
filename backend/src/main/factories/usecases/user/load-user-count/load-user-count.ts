import { LoadUserCountData } from '@/data/usecases/user/load-user-count'
import { LoadUserCount } from '@/domain/usecase/user/load-user-count'
import { UserRepository } from '@/infra/db/repositories/user-repository'

export function makeLoadUserCount (): LoadUserCount {
  const dbCountUser = new UserRepository()
  const counter = new LoadUserCountData(dbCountUser)
  return counter
}
