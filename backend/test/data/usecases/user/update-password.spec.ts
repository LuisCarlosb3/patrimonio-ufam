import { Hasher } from '@/data/protocols/criptography/hasher'
import { DbUpdateUserPasswordById } from '@/data/protocols/db/db-update-user-password-by-id'
import { UserUpdatePasswordData } from '@/data/usecases/user/update-password'

const makeHashPassword = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('any_hash')
    }
  }
  return new HasherStub()
}
const makeDbUpdatePassword = (): DbUpdateUserPasswordById => {
  class DbUpdateUserPasswordByIdStub implements DbUpdateUserPasswordById {
    async updateById (userId: string, newPassword: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbUpdateUserPasswordByIdStub()
}

interface Sut {
  sut: UserUpdatePasswordData
  hasher: Hasher
  updatePassword: DbUpdateUserPasswordById
}
const makeSut = (): Sut => {
  const hasher = makeHashPassword()
  const updatePassword = makeDbUpdatePassword()
  const sut = new UserUpdatePasswordData(hasher, updatePassword)
  return { sut, hasher, updatePassword }
}
describe('UserUpdatePasswordData', () => {
  test('ensure UserUpdatePasswordData hash password', async () => {
    const { sut, hasher } = makeSut()
    const hashSpy = jest.spyOn(hasher, 'hash')
    await sut.updatePassword('user_id', 'new_password')
    expect(hashSpy).toHaveBeenLastCalledWith('new_password')
  })
  test('ensure UserUpdatePasswordData throws if hash throws', async () => {
    const { sut, hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.updatePassword('user_id', 'new_password')
    await expect(promise).rejects.toThrow()
  })
  test('ensure UserUpdatePasswordData hash password', async () => {
    const { sut, updatePassword } = makeSut()
    const updatepy = jest.spyOn(updatePassword, 'updateById')
    await sut.updatePassword('user_id', 'new_password')
    expect(updatepy).toHaveBeenLastCalledWith('user_id', 'any_hash')
  })
})
