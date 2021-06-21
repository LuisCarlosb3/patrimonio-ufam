import { Patrimony } from './patrimony'

export interface StatementResponsability {
  id: string
  responsibleName: string
  siapeCode: string
  emissionDate: Date
  patrimonies: Patrimony[]
}
