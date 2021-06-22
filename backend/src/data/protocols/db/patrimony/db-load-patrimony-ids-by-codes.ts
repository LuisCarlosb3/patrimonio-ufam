export interface DbLoadPatrimonyIdsByCodes {
  loadByCodes(codes: string[]): Promise<string[]>
}
