
export interface DbCheckPatrimonyByCode{
  checkByCode(code: string): Promise<string>
}
