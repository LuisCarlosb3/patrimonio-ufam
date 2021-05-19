
export interface UserRecoverPassword {
  recover(registration: string, recoverLink: string): Promise<boolean>
}
