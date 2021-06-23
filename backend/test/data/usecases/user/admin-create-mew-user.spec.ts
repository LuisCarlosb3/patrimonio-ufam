import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbCreateNewUser, DbCreateNewUserModel } from '@/data/protocols/db/user/db-create-new-user'
import { DbLoadUserByEmailAndRegistration } from '@/data/protocols/db/user/db-load-user-by-email-and-registration'
import { CreateNewUserData } from '@/data/usecases/user/admin-create-mew-user'
import { User, UserPermission } from '@/domain/model/user'
import { NewUserModel } from '@/domain/usecase/user/create-user-by-admin'
import MockDate from 'mockdate'
const makeFakeUser = (): User => {
  return {
    id: 'any_id',
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'hash_password',
    permission: UserPermission.INVENTORIOUS
  }
}
const makeFakeUserModel = (): NewUserModel => {
  return {
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    permission: UserPermission.INVENTORIOUS,
    password: 'password'
  }
}
function makeFakeDbLoadUserByEmail (): DbLoadUserByEmailAndRegistration {
  class DbLoadUserByEmailStub implements DbLoadUserByEmailAndRegistration {
    async loadByEmailAndRegistration (email: string, registration: string): Promise<User> {
      return await Promise.resolve(null)
    }
  }
  return new DbLoadUserByEmailStub()
}
function makeFakeHasher (): Hasher {
  class HashStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('any_hash')
    }
  }
  return new HashStub()
}
function makeFakeDbCreateNewUser (): DbCreateNewUser {
  class DbCreateNewUserStub implements DbCreateNewUser {
    async create (newUser: DbCreateNewUserModel): Promise<User> {
      return await Promise.resolve(makeFakeUser())
    }
  }
  return new DbCreateNewUserStub()
}
interface Sut {
  sut: CreateNewUserData
  dbLoadUserByEmail: DbLoadUserByEmailAndRegistration
  hasher: Hasher
  dbCreateNewUser: DbCreateNewUser
}

function makeSut (): Sut {
  const dbLoadUserByEmail = makeFakeDbLoadUserByEmail()
  const hasher = makeFakeHasher()
  const dbCreateNewUser = makeFakeDbCreateNewUser()
  const sut = new CreateNewUserData(dbLoadUserByEmail, hasher, dbCreateNewUser)
  return { sut, dbLoadUserByEmail, hasher, dbCreateNewUser }
}

describe('AdminCreateNewUserData', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('ensure AdminCreateNewUserData calls load user by email and registration', async () => {
    const { sut, dbLoadUserByEmail } = makeSut()
    const loadSpy = jest.spyOn(dbLoadUserByEmail, 'loadByEmailAndRegistration')
    const user = makeFakeUserModel()
    await sut.create(user)
    expect(loadSpy).toHaveBeenCalledWith(user.email, user.registration)
  })
  test('ensure AdminCreateNewUserData returns parameter name if load user by email and registration returns user info', async () => {
    const { sut, dbLoadUserByEmail } = makeSut()
    jest.spyOn(dbLoadUserByEmail, 'loadByEmailAndRegistration').mockResolvedValue(makeFakeUser())
    let user = { ...makeFakeUserModel(), registration: 'other_registration' }
    let res = await sut.create(user)
    expect(res).toEqual(['email'])
    user = { ...makeFakeUserModel(), email: 'other_email' }
    res = await sut.create(user)
    expect(res).toEqual(['registration'])
    jest.spyOn(dbLoadUserByEmail, 'loadByEmailAndRegistration').mockReset()
  })
  test('ensure AdminCreateNewUserData calls create new user user data', async () => {
    const { sut, dbCreateNewUser } = makeSut()
    const createSpy = jest.spyOn(dbCreateNewUser, 'create')
    const user = makeFakeUserModel()
    await sut.create(user)
    const { id, ...userInfo } = makeFakeUser()
    expect(createSpy).toHaveBeenCalledWith({ ...userInfo, password: 'any_hash' })
  })
  test('ensure AdminCreateNewUserData calls create new user user data', async () => {
    const { sut } = makeSut()
    const user = makeFakeUserModel()
    const res = await sut.create(user)
    expect(res).toEqual(makeFakeUser())
  })
})
