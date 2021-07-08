import { ListUsersController } from '@/presentation/controllers/user/list-users-controller'
import { makeLoadUserCount } from '../../usecases/user/load-user-count/load-user-count'
import { makeLoadUserList } from '../../usecases/user/load-user-list/load-user-list'

export function makeListUserControllerFactory (): ListUsersController {
  const loadUserCount = makeLoadUserCount()
  const loadUserList = makeLoadUserList()
  const controller = new ListUsersController(loadUserList, loadUserCount)
  return controller
}
