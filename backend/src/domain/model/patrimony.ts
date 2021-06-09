export interface Patrimony {
  id: string
  code: string
  description: string
  state: PatrimonyState
  entryDate: Date
  lastConferenceDate: Date
  value: number
  patrimonyItens: PatrimonyItens[]
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
  UNSERVIBLE = 'INSERVÍVEl',
  UNRECOVERABLE = 'RECUPERÁVEL',
  UNECONOMICAL = 'ANTIECONÔMICO'
}
