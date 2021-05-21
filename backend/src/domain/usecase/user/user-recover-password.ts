
export interface UserRecoverPassword {
  recover(registration: string): Promise<string>
}
