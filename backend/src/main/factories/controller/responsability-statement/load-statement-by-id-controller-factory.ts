import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { GetStatementByIdController } from '@/presentation/controllers/responsability-statement/get-responsability-statement-by-id-controller'
import { makeLoadStatementById } from '../../usecases/responsability-statement/load-statement-by-id/load-statement-by-id'

export function makeLoadStatementByIdController (): GetStatementByIdController {
  const rules = {
    id: ['required', 'string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i']
  }
  const validator = new ValidatorJsAdapter(rules)
  const loadById = makeLoadStatementById()
  const controller = new GetStatementByIdController(loadById, validator)
  return controller
}
