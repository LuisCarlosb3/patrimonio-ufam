export interface DbDeleteUserByRecoverByID {
  deleteById(linkId: string): Promise<void>
}
