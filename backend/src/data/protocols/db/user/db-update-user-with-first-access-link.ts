export interface DbCreateFirsAccessLink {
  createLink(userId: string, accessLink: string): Promise<void>
}
