
export interface CheckPatrimonyCodeExists {
  loadByCode(code: string): Promise<boolean>
}
