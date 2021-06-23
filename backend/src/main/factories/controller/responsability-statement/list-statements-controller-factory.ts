import { makeListResponsabilityStatementData } from '../../usecases/list-responsability-statement/list-statements-factory'
import { ListResponsabilityStatementController } from '@/presentation/controllers/responsability-statement/list-resposability-statement-controller'
import { HttpController } from '@/presentation/protocols/http-controller'

export function makeListResponsabilityStatementsController (): HttpController {
  const listPatrimonyData = makeListResponsabilityStatementData()
  const controller = new ListResponsabilityStatementController(listPatrimonyData)
  return controller
}
