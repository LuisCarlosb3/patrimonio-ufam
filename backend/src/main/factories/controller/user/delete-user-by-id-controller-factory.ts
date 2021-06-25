import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { DeleteUserByIdController } from '@/presentation/controllers/user/delete-user-by-id-controller'
import { makeDeleteUserById } from '../../usecases/user/delete-user-by-id/delete-user-by-id'
import { makeLoadUserById } from '../../usecases/user/load-user-by-id/load-user-by-id-factory'

export function makeDeleteUserByIdController (): DeleteUserByIdController {
  const rules = {
    id: ['required', 'string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i']
  }
  const deleteById = makeDeleteUserById()
  const loadUserById = makeLoadUserById()
  const validator = new ValidatorJsAdapter(rules)
  const controller = new DeleteUserByIdController(deleteById, validator, loadUserById)
  return controller
}
