import { Permission, Line } from '@/domain/model/operator'

export default interface Decrypter {
  decrypt(token: string): Promise<{ id: string, permission: Permission, line?: Line[] }>
}
