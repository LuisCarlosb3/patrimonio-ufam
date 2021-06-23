import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { CreateResponsabilityStatementController } from '@/presentation/controllers/responsability-statement/create-responsability-statement-controller'
import { makeCheckIfPatrimonyStatementExists } from '../../usecases/responsability-statement/check-if-patrimony-statement-exists/check-if-patrimony-statement-exists'
import { makeCreateResponsabilityStatement } from '../../usecases/responsability-statement/create-reponsability-statement/create-responsability-statement'
import { makeLoadPatrimonyByCode } from '../../usecases/patrimony/load-patrimony-by-code/load-patrimony-by-code'

export function makeCreateResponsabilityStatementController (): CreateResponsabilityStatementController {
  const rules = {
    newStatement: {
      responsibleName: 'required|string',
      siapeCode: 'required|string',
      emissionDate: 'required|date',
      patrimoniesCode: 'required|array'
    }
  }

  const validator = new ValidatorJsAdapter(rules)
  const loadByCode = makeLoadPatrimonyByCode()
  const checkIfExists = makeCheckIfPatrimonyStatementExists()
  const createStatement = makeCreateResponsabilityStatement()
  const controller = new CreateResponsabilityStatementController(validator, loadByCode, checkIfExists, createStatement)
  return controller
}
