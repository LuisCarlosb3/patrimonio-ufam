import { Patrimony } from '@/domain/model/patrimony'

export interface LoadPatrimonyById {
  laodById(id: string): Promise<Patrimony>
}
