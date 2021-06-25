import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { UpdateStatementController } from '@/presentation/controllers/responsability-statement/update-statement-by-id-controller'
import { makeLoadPatrimonyById } from '../../usecases/patrimony/load-patrimony-by-id/load-patrimony-by-id'
import { makeLoadStatementById } from '../../usecases/responsability-statement/load-statement-by-id/load-statement-by-id'
import { makeUpdateStatementById } from '../../usecases/responsability-statement/update-statement-by-id/update-statement-by-id'

export function makeUpdateResponsabilityStatementController (): UpdateStatementController {
  const rules = {
    statement: {
      id: ['required', 'string', 'regex:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i'],
      responsibleName: 'required|string',
      siapeCode: 'required|string',
      emissionDate: 'required|date',
      removedPatrimonies: 'required|array',
      addedPatrimonies: 'required|array'
    }
  }
  const validator = new ValidatorJsAdapter(rules)
  const updateById = makeUpdateStatementById()
  const loadPatrimonyById = makeLoadPatrimonyById()
  const loadStatemendById = makeLoadStatementById()
  const controller = new UpdateStatementController(validator, updateById, loadPatrimonyById, loadStatemendById)
  return controller
}
