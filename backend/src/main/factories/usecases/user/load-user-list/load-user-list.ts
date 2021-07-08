import { LoadUsersListData } from '@/data/usecases/user/load-users-list'
import { LoadUserList } from '@/domain/usecase/user/list-user'
import { UserRepository } from '@/infra/db/repositories/user-repository'

export function makeLoadUserList (): LoadUserList {
  const dbLoadUserList = new UserRepository()
  const loadUserList = new LoadUsersListData(dbLoadUserList)
  return loadUserList
}
