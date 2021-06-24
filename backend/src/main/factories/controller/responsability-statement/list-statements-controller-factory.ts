import { makeListResponsabilityStatementData } from '../../usecases/responsability-statement/list-responsability-statement/list-statements-factory'
import { ListResponsabilityStatementController } from '@/presentation/controllers/responsability-statement/list-resposability-statement-controller'
import { HttpController } from '@/presentation/protocols/http-controller'
import { makeLoadStatementByCodeOrSiape } from '../../usecases/responsability-statement/load-statement-by-code-or-siape/load-statement-by-code-or-siape'

export function makeListResponsabilityStatementsController (): HttpController {
  const listPatrimonyData = makeListResponsabilityStatementData()
  const listPatrimonyDataWithFilter = makeLoadStatementByCodeOrSiape()
  const controller = new ListResponsabilityStatementController(listPatrimonyData, listPatrimonyDataWithFilter)
  return controller
}
