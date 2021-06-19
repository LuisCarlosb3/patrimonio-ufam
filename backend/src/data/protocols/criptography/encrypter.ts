export default interface Encrypter {
  encrypt(value: { id: string, permission: number }): Promise<string>
}
