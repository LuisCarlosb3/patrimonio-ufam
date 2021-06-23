import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { DeletePatrimonyByIdController } from '@/presentation/controllers/patrimony/delete-patrimony-by-id-controller'
import { makeDeletePatrimonyById } from '../../usecases/patrimony/delete-patrimony-by-id/delete-patrimony-by-id'
import { makeLoadPatrimonyById } from '../../usecases/patrimony/load-patrimony-by-id/load-patrimony-by-id'

export function makeDeletePatrimonyByIdController (): DeletePatrimonyByIdController {
  const rules = {
    id: ['required', 'string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i']
  }
  const validator = new ValidatorJsAdapter(rules)
  const loadPatrimony = makeLoadPatrimonyById()
  const deletePatrimonyById = makeDeletePatrimonyById()
  const controller = new DeletePatrimonyByIdController(validator, loadPatrimony, deletePatrimonyById)
  return controller
}
