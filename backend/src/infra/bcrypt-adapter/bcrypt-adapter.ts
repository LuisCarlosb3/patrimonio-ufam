import { HashComparer } from '@/data/protocols/criptography/hash-compare'
import bcrypt from 'bcrypt'
import { Hasher } from '@/data/protocols/criptography/hasher'
export default class BcryptAdapter implements HashComparer, Hasher {
  constructor (private readonly salt: number) {}
  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<Boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return await Promise.resolve(isValid)
  }
}
