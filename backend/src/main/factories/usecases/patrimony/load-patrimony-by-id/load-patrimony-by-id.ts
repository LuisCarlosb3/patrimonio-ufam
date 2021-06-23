import { LoadPatrimonyByIdData } from '@/data/usecases/patrimony/load-patrimony-by-id'
import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeLoadPatrimonyById (): LoadPatrimonyById {
  const loadRepository = new PatrimonyRepository()
  const loadPatrimonyById = new LoadPatrimonyByIdData(loadRepository)
  return loadPatrimonyById
}
