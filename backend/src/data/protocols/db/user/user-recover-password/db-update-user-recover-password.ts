export interface DbUpdateUserRecoverLink {
  update(id: string, link: string): Promise<boolean>
}
