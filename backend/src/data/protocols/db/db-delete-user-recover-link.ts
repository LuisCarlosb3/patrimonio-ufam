export interface DbRemoveUsedUserLinkById{
  delete(link: string): Promise<void>
}
