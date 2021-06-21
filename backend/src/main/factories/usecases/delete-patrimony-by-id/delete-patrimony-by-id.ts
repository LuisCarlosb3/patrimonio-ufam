import { DeletePatrimonyByIdData } from '@/data/usecases/patrimony/delete-patrimony-by-id'
import { DeletePatrimonyById } from '@/domain/usecase/patrimony/delete-patrimony-by-id'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeDeletePatrimonyById (): DeletePatrimonyById {
  const deleteRepository = new PatrimonyRepository()
  const deletePatrimonyById = new DeletePatrimonyByIdData(deleteRepository)
  return deletePatrimonyById
}
