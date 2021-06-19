export interface DbRemoveUsedUserLinkById{
  deleteByLink(link: string): Promise<void>
}
