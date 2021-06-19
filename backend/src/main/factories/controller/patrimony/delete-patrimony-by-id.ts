import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { DeletePatrimonyByIdController } from '@/presentation/controllers/patrimony/delete-patrimony-by-id-controller'
import { makeDeletePatrimonyById } from '../../usecases/delete-patrimony-by-id/delete-patrimony-by-id'
import { makeLoadPatrimonyById } from '../../usecases/load-patrimony-by-id/load-patrimony-by-id'

export function makeDeletePatrimonyByIdController (): DeletePatrimonyByIdController {
  const rules = {
    id: 'required|string'
  }
  const validator = new ValidatorJsAdapter(rules)
  const loadPatrimony = makeLoadPatrimonyById()
  const deletePatrimonyById = makeDeletePatrimonyById()
  const controller = new DeletePatrimonyByIdController(validator, loadPatrimony, deletePatrimonyById)
  return controller
}
