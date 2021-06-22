import { Patrimony } from './patrimony'

export interface ResponsabilityStatement {
  id: string
  code: string
  responsibleName: string
  siapeCode: string
  emissionDate: Date
  patrimonies: Patrimony[]
}
