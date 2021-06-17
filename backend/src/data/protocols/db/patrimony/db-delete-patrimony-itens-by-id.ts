export interface DbDeletePatrimonyItenById {
  deleteById(itenId: string | string[]): Promise<void>
}
