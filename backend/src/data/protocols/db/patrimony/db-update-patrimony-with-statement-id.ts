export interface DbUpdateStatementIdOnPatrimonyById {
  updateStatement(patrimonyIds: string[], statementId: string): Promise<void>
}
