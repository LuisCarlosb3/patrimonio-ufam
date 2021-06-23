import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbCreateNewUser } from '@/data/protocols/db/user/db-create-new-user'
import { DbLoadUserByEmailAndRegistration } from '@/data/protocols/db/user/db-load-user-by-email-and-registration'
import { User } from '@/domain/model/user'
import { CreateNewUser, NewUserModel } from '@/domain/usecase/user/create-user-by-admin'

export class CreateNewUserData implements CreateNewUser {
  constructor (
    private readonly dbLoadUserByEmail: DbLoadUserByEmailAndRegistration,
    private readonly hasher: Hasher,
    private readonly dbCreateNewUser: DbCreateNewUser
  ) {}

  async create (newUser: NewUserModel): Promise<User | string[]> {
    const userData = await this.dbLoadUserByEmail.loadByEmailAndRegistration(newUser.email, newUser.registration)
    if (userData) {
      const parametersName = []
      if (newUser.registration === userData.registration) { parametersName.push('registration') }
      if (newUser.email === userData.email) { parametersName.push('email') }
      return parametersName
    }
    const passwordHash = await this.hasher.hash(newUser.password)
    const newUserCreated = await this.dbCreateNewUser.create({ ...newUser, password: passwordHash })
    return newUserCreated
  }
}
