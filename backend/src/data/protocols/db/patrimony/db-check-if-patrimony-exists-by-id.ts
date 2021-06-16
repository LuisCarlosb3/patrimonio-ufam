
export interface DbCheckIfPatrimonyExists{
  verifyById(id: string): Promise<boolean>
}
