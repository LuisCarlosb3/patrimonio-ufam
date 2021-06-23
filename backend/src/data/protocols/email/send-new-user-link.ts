export default interface SendNewUserNotification {
  sendNewNewUserNotify(email: string): Promise<void>
}
