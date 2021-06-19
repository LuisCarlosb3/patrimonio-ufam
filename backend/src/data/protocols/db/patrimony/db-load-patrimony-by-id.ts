import { Patrimony } from '@/domain/model/patrimony'

export interface DbLoadPatrimonyById{
  loadById(id: string): Promise<Patrimony>
}
