import { UpdatePatrimonyByIdData } from '@/data/usecases/patrimony/update-patrimony-by-id'
import { UpdatePatrimonyById } from '@/domain/usecase/patrimony/update-patrimony-by-id'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeUpdatePatrimonyById (): UpdatePatrimonyById {
  const updateByIdRepository = new PatrimonyRepository()
  const insertNewItens = new PatrimonyRepository()
  const dbDeleteItensById = new PatrimonyRepository()
  const updateByIdData = new UpdatePatrimonyByIdData(updateByIdRepository, insertNewItens, dbDeleteItensById)
  return updateByIdData
}
