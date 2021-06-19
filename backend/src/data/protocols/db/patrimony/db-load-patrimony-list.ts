import { Patrimony } from '@/domain/model/patrimony'

export interface DbLoadPatrimonyList {
  load(page: number, quantityPeerPage: number): Promise<Patrimony[]>
}
