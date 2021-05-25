export default interface SendRecoverPasswordEmail {
  sendRecover(email: string, newPasswordLink: string): Promise<void>
}
