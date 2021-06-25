export interface DbDeleteStatementById {
  deleteById(statementId: string): Promise<void>
}
