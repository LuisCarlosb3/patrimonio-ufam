import { ListPatrimonyController } from '@/presentation/controllers/patrimony/list-patrimony-controller'
import { makeListPatrimonyData } from '../../usecases/list-patrimonies/list-patrimonies-factory'
import { HttpController } from '@/presentation/protocols/http-controller'

export function makeListPatrimonyController (): HttpController {
  const listPatrimonyData = makeListPatrimonyData()
  const controller = new ListPatrimonyController(listPatrimonyData)
  return controller
}
