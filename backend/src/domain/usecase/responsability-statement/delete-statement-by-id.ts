export interface DeleteStatementById {
  deleteById(statementId: string): Promise<boolean>
}
