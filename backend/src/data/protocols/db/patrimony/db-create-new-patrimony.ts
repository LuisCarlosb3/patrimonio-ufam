import { NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'
export interface DbCreateNewPatrimony {
  create(newPatrimony: NewPatrimonyModel): Promise<string>
}
