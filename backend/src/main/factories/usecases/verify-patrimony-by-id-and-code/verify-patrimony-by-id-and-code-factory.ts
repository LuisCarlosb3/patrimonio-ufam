import { CheckPatrimonyIdAndCodeToUpdateData } from '@/data/usecases/patrimony/check-patrimony-id-and-code'
import { CheckPatrimonyIdAndCodeToUpdate } from '@/domain/usecase/patrimony/check-patrimony-id-and-code'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeCheckPatrimonyIdAndCodeToUpdate (): CheckPatrimonyIdAndCodeToUpdate {
  const loadPatrimonyById = new PatrimonyRepository()
  const checkPatrimonyCode = new PatrimonyRepository()
  return new CheckPatrimonyIdAndCodeToUpdateData(loadPatrimonyById, checkPatrimonyCode)
}
