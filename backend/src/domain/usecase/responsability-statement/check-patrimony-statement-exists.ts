import { ResponsabilityStatement } from '@/domain/model/responsability-statement'

export interface PatrimonyStatementItem extends Omit<ResponsabilityStatement, 'patrimonies'>{
  patrimonyId: string
}

export interface CheckIfPatrimonyStatementExists {
  loadStatement(patrimonyId: string): Promise<PatrimonyStatementItem>
}
