import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { GetPatrimonyByCodeController } from '@/presentation/controllers/patrimony/get-patrimony-by-code-controller'
import { makeLoadPatrimonyByCode } from '../../usecases/patrimony/load-patrimony-by-code/load-patrimony-by-code'

export function makeLoadPatrimonyByCodeController (): GetPatrimonyByCodeController {
  const rules = {
    code: 'required|string'
  }
  const loadByCodeData = makeLoadPatrimonyByCode()
  const validator = new ValidatorJsAdapter(rules)
  const getByCodeController = new GetPatrimonyByCodeController(loadByCodeData, validator)
  return getByCodeController
}
