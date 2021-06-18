import { Patrimony } from '@/domain/model/patrimony'

export interface DbCheckPatrimonyByCode{
  checkByCode(code: string): Promise<Patrimony>
}
