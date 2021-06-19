import { LoadPatrimonyByCodeData } from '@/data/usecases/patrimony/load-patrimony-by-code'
import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeLoadPatrimonyByCode (): LoadPatrimonyByCode {
  const loadRepository = new PatrimonyRepository()
  const loadPatrimonyByCode = new LoadPatrimonyByCodeData(loadRepository)
  return loadPatrimonyByCode
}
