import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { DeleteResponsabilityStatementeByIdController } from '@/presentation/controllers/responsability-statement/delete-responsability-statement-by-id-controller'
import { makeDeleteStatementById } from '../../usecases/responsability-statement/delete-statement-by-id/delete-statement-by-id'
import { makeLoadStatementById } from '../../usecases/responsability-statement/load-statement-by-id/load-statement-by-id'
import { makeLoadUserById } from '../../usecases/user/load-user-by-id/load-user-by-id-factory'

export function makeDeleteStatementByIdController (): DeleteResponsabilityStatementeByIdController {
  const rules = {
    id: ['required', 'string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i']
  }
  const validator = new ValidatorJsAdapter(rules)
  const deleteById = makeDeleteStatementById()
  const loadStatementById = makeLoadStatementById()
  const loadUserById = makeLoadUserById()
  const controller = new DeleteResponsabilityStatementeByIdController(validator, deleteById, loadStatementById, loadUserById)
  return controller
}
