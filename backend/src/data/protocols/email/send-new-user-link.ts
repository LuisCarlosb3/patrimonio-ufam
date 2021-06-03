export default interface SendNewUserAccessLink {
  sendNewAccessLink(email: string, link: string): Promise<void>
}
