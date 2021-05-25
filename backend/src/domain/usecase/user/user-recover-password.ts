
export interface UserRecoverPassword {
  recover(registration: string): Promise<{email: string, hashlink: string}>
}
export interface CheckUserRecoverLink {
  verify(link: string): Promise<string>
}
