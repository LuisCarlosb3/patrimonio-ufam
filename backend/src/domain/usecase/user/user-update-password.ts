export interface UserUpdatePassword {
  updatePassword(userId: string, newPassword: string): Promise<boolean>
}
