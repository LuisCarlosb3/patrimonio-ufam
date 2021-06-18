import { Patrimony } from '@/domain/model/patrimony'

export interface DbUpdatePatrimonyById {
  updateById(patrimony: Patrimony): Promise<void>
}
