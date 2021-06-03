import { DbLoadUserByRecoverLink } from '@/data/protocols/db/user/check-user-recover-password/db-load-user-by-link'
import { UserRecover } from '@/domain/model/user'
import { CheckUserRecoverPassword } from '@/data/usecases/user/check-user-recover-password'
import { DbDeleteUserByRecoverByID } from '@/data/protocols/db/user/check-user-recover-password/db-delete-user-link'
const makeFakeLinkData = (expiresAt: Date): UserRecover => {
  return {
    id: 'any_id',
    userId: 'user_id',
    link: 'any_link',
    expiresAt: expiresAt
  }
}

function makeDbUserByRecoveryLink (): DbLoadUserByRecoverLink {
  class DbLoadUserByRecoverLinkStub implements DbLoadUserByRecoverLink {
    async loadByLink (link: string): Promise<UserRecover> {
      const expiresAt = new Date()
      expiresAt.setHours(new Date().getHours() + 1)
      return await Promise.resolve(makeFakeLinkData(expiresAt))
    }
  }
  return new DbLoadUserByRecoverLinkStub()
}
function makeDbDeleteLinkById (): DbDeleteUserByRecoverByID {
  class DbDeleteUserByRecoverByIDStub implements DbDeleteUserByRecoverByID {
    async deleteById (linkId: string): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new DbDeleteUserByRecoverByIDStub()
}
interface Sut {
  sut: CheckUserRecoverPassword
  dbLoadUser: DbLoadUserByRecoverLink
  dbDeleteById: DbDeleteUserByRecoverByID
}

const makeSut = (): Sut => {
  const dbLoadUser = makeDbUserByRecoveryLink()
  const dbDeleteById = makeDbDeleteLinkById()
  const sut = new CheckUserRecoverPassword(dbLoadUser, dbDeleteById)
  return { sut, dbLoadUser, dbDeleteById }
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
    jest.spyOn(dbLoadUser, 'loadByLink').mockResolvedValueOnce(makeFakeLinkData(expiresAt))
    const res = await sut.verify('any_link')
    expect(res).toEqual(null)
  })
  test('Ensure sut CheckUserRecoverPassword call DbDeleteUserByRecoverByID with link id on link expires', async () => {
    const { sut, dbLoadUser, dbDeleteById } = makeSut()
    const expiresAt = new Date()
    expiresAt.setHours(new Date().getHours())
    jest.spyOn(dbLoadUser, 'loadByLink').mockResolvedValueOnce(makeFakeLinkData(expiresAt))
    const loadSpy = jest.spyOn(dbDeleteById, 'deleteById')
    await sut.verify('any_link')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  test('Ensure sut CheckUserRecoverPassword dont call DbDeleteUserByRecoverByID with link id on link not expires', async () => {
    const { sut, dbDeleteById } = makeSut()
    const loadSpy = jest.spyOn(dbDeleteById, 'deleteById')
    await sut.verify('any_link')
    expect(loadSpy).not.toHaveBeenCalled()
  })
})
