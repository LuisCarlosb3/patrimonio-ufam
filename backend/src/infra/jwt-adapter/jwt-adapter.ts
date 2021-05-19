import Encrypter from '@/data/protocols/criptography/encrypter'
import Decrypter from '@/data/protocols/criptography/decrypter'
import jwt from 'jsonwebtoken'
export default class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }
  async decrypt (token: string): Promise<{ id: string, permission: number }> {
    const payload = jwt.verify(token, this.secret)
    return { id: payload?.['id'], permission: payload?.['permission'] }
  }

  async encrypt (value: { id: string, permission: number }): Promise<string> {
    const token = jwt.sign(value, this.secret)
    return token
  }
}
