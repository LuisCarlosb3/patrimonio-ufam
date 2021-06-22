export interface DbCheckIfCodeExists {
  verifyCode(code: string): Promise<boolean>
}
