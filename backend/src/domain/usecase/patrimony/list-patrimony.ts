import { Patrimony } from '@/domain/model/patrimony'

export interface LoadPatrimonyList {
  load(page?: number, quantityPeerPage?: number): Promise<Patrimony[]>
}
