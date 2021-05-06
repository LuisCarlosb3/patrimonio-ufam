
export interface AuthenticationModel {
  registration: string
  password: string
}

export interface UserAuthentication {
  auth(auth: AuthenticationModel): Promise<string>
}
