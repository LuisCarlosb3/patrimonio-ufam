export interface StatementItem {
  patrimonyId: string
  responsabilityStatementId: string
}

export interface CheckIfPatrimonyStatementExists {
  loadStatement(patrimonyId: string): Promise<StatementItem>
}
