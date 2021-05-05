import Encrypter from '@/data/protocols/criptography/encrypter'
import Decrypter from '@/data/protocols/criptography/decrypter'
import { Permission, Line } from '@/domain/model/operator'
import jwt from 'jsonwebtoken'
export default class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }
  async decrypt (token: string): Promise<{ id: string, permission: Permission, line?: Line[] }> {
    const payload = await jwt.verify(token, this.secret)
    return { id: payload?.['id'], permission: payload?.['permission'], line: payload?.['line'] }
  }

  async encrypt (value: { id: string, permission: string, line?: string[] }): Promise<string> {
    const token = await jwt.sign(value, this.secret)
    return token
  }
}
