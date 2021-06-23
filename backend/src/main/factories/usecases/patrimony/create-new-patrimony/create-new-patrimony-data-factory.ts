import { CreateNewPatrimonyData } from '@/data/usecases/patrimony/create-new-patrimony'
import { CreateNewPatrimony } from '@/domain/usecase/patrimony/create-patrimony'
import { PatrimonyRepository } from '@/infra/db/repositories/patrimony'

export function makeCreateNewPatrimonyData (): CreateNewPatrimony {
  const checkPatrimonyCode = new PatrimonyRepository()
  const dbCreateNewPatrimony = new PatrimonyRepository()
  const createNewPatrimonyData = new CreateNewPatrimonyData(checkPatrimonyCode, dbCreateNewPatrimony)
  return createNewPatrimonyData
}
