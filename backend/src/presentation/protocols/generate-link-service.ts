export interface GenerateRecoverPasswordLink {
  generate(userRegistration: string): Promise<string>
}
