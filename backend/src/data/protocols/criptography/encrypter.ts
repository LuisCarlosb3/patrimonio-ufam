export default interface Encrypter {
  encrypt(value: { id: string, permission: string, line?: string[] }): Promise<string>
}
