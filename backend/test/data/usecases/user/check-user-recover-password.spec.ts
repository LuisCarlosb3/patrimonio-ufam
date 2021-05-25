import { DbLoadUserByRecoverLink } from '@/data/protocols/db/check-user-recover-password/db-load-user-by-link'
import { UserRecover } from '@/domain/model/user'
import { CheckUserRecoverPassword } from '@/data/usecases/user/check-user-recover-password'
function makeDbUserByRecoveryLink (): DbLoadUserByRecoverLink {
  class DbLoadUserByRecoverLinkStub implements DbLoadUserByRecoverLink {
    async loadByLink (link: string): Promise<UserRecover> {
      return await Promise.resolve({
        id: 'any_id',
        userId: 'user_id',
        link: 'any_link',
        expiresAt: new Date()
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
})
