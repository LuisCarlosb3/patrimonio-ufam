export interface DeleteUserById {
  deleteById(userId: string): Promise<void>
}
