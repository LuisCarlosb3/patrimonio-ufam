export interface DbUpdateUserPasswordById {
  updateById(userId: string, newPassword: string): Promise<void>
}
