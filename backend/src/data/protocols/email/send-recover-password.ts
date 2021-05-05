export default interface SendRecoverPasswordEmail {
  sendRecover(email: string, newPassword: string): Promise<void>
}
