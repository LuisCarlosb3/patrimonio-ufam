
export interface UserRecoverPassword {
  recover(registration: string): Promise<{email: string, hashlink: string}>
}
