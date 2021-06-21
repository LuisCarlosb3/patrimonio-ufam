export interface DbDeletePatrimonyItenById {
  deleteItensById(itemId: string | string[]): Promise<void>
}
