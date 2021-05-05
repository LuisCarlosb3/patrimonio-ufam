export default interface SendNewPasswordEmail {
  sendNewPassword(email: string, newPassword: string): Promise<void>
}
