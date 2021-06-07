import Encrypter from '@/data/protocols/criptography/encrypter'
import Decrypter from '@/data/protocols/criptography/decrypter'
import jwt from 'jsonwebtoken'
export default class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }
  async decrypt (token: string): Promise<{ id: string, permission: number }> {
    const payload = await new Promise<string | object>(resolve => {
      jwt.verify(token, this.secret, function (err, decoded) {
        if (err) {
          resolve(err.name)
        }
        resolve(decoded)
      })
    })
    if (typeof (payload) === 'string') {
      return null
    }
    return { id: payload?.['id'], permission: payload?.['permission'] }
  }

  async encrypt (value: { id: string, permission: number }): Promise<string> {
    const token = await jwt.sign(value, this.secret)
    return token
  }
}
