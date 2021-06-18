import { Patrimony } from '@/domain/model/patrimony'

export interface LoadPatrimonyByCode {
  loadByCode(code: string): Promise<Patrimony>
}
