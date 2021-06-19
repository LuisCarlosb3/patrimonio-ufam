export interface DbCreateUserAccessToken {
  createUserToken(userId: string, token: string): Promise<void>
}
