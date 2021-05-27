import { DbLoadUserByRecoverLink } from '@/data/protocols/db/check-user-recover-password/db-load-user-by-link'
import { UserRecover } from '@/domain/model/user'
import { CheckUserRecoverPassword } from '@/data/usecases/user/check-user-recover-password'
function makeDbUserByRecoveryLink (): DbLoadUserByRecoverLink {
  class DbLoadUserByRecoverLinkStub implements DbLoadUserByRecoverLink {
    async loadByLink (link: string): Promise<UserRecover> {
      const expiresAt = new Date()
      expiresAt.setHours(new Date().getHours() + 1)
      return await Promise.resolve({
        id: 'any_id',
        userId: 'user_id',
        link: 'any_link',
        expiresAt: expiresAt
      })
    }
  }
  return new DbLoadUserByRecoverLinkStub()
}
interface Sut {
  sut: CheckUserRecoverPassword
  dbLoadUser: DbLoadUserByRecoverLink
}

const makeSut = (): Sut => {
  const dbLoadUser = makeDbUserByRecoveryLink()
  const sut = new CheckUserRecoverPassword(dbLoadUser)
  return { sut, dbLoadUser }
}

describe('CheckUserRecoverPassword', () => {
  test('Ensure sut CheckUserRecoverPassword call dbLoadUserRecover with link', async () => {
    const { sut, dbLoadUser } = makeSut()
    const loadSpy = jest.spyOn(dbLoadUser, 'loadByLink')
    await sut.verify('any_link')
    expect(loadSpy).toHaveBeenCalledWith('any_link')
  })
  test('Ensure sut CheckUserRecoverPassword returns null if dbLoadUserRecover returns null', async () => {
    const { sut, dbLoadUser } = makeSut()
    jest.spyOn(dbLoadUser, 'loadByLink').mockResolvedValueOnce(null)
    const res = await sut.verify('any_link')
    expect(res).toEqual(null)
  })
  test('Ensure sut CheckUserRecoverPassword returns user id on success', async () => {
    const { sut } = makeSut()
    const res = await sut.verify('any_link')
    expect(res).toEqual('user_id')
  })
  test('Ensure sut CheckUserRecoverPassword returns null if link has expired', async () => {
    const { sut, dbLoadUser } = makeSut()
    const expiresAt = new Date()
    expiresAt.setHours(new Date().getHours())
    jest.spyOn(dbLoadUser, 'loadByLink').mockResolvedValueOnce({
      id: 'any_id',
      userId: 'user_id',
      link: 'any_link',
      expiresAt: expiresAt
    })
    const res = await sut.verify('any_link')
    expect(res).toEqual(null)
  })
})
