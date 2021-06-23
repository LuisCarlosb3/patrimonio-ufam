import { LoadPatrimonyListData } from '@/data/usecases/patrimony/load-patrimony-list'
import { LoadPatrimonyList } from '@/domain/usecase/patrimony/list-patrimony'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeListPatrimonyData (): LoadPatrimonyList {
  const patrimonyRepository = new PatrimonyRepository()
  const loadPatrimonyListData = new LoadPatrimonyListData(patrimonyRepository)
  return loadPatrimonyListData
}
