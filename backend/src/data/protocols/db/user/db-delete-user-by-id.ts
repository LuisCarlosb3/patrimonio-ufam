export interface DbDeleteUserById {
  deleteById(userId: string): Promise<void>
}
