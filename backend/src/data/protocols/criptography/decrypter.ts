
export default interface Decrypter {
  decrypt(token: string): Promise< { id: string, permission: number }>
}
