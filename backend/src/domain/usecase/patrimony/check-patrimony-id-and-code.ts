import { Patrimony } from '@/domain/model/patrimony'

export interface CheckPatrimonyIdAndCodeToUpdate{
  verifyPatrimony(id: string, code: string): Promise<Patrimony | Error>
}
