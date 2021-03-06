
export interface Patrimony {
  id: string
  code: string
  description: string
  state: PatrimonyState
  entryDate: Date
  lastConferenceDate: Date
  value: number
  patrimonyItens: PatrimonyItens[]
  statementCode?: string
}
export interface PatrimonyItens {
  id: string
  name: string
  localization: string
  observation?: string
}
export enum PatrimonyState {
  NEW = 'NOVO',
  GOOD = 'BOM',
  UNSERVIBLE = 'INSERVIVEl',
  UNRECOVERABLE = 'RECUPERAVEL',
  UNECONOMICAL = 'ANTIECONOMICO'
}
