import { CreateNewUserLinkData } from '@/data/usecases/user/create-new-user-link'
import { DbCreateFirsAccessLink } from '@/data/protocols/db/user/db-update-user-with-first-access-link'
const fakeString = 'c82f563848f7782b8a9fdef5776'
jest.mock('crypto', () => ({
  randomBytes: () => fakeString
}))

const makeCreateFirstAccessLink = (): DbCreateFirsAccessLink => {
  class DbCreateFirsAccessLinkStub implements DbCreateFirsAccessLink {
    async createLink (userId: string, accessLink: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new DbCreateFirsAccessLinkStub()
}
interface Sut {
  sut: CreateNewUserLinkData
  dbCreateFirsAccessLink: DbCreateFirsAccessLink
}
const makeSut = (): Sut => {
  const dbCreateFirsAccessLink = makeCreateFirstAccessLink()
  const sut = new CreateNewUserLinkData(dbCreateFirsAccessLink)
  return {
    sut,
    dbCreateFirsAccessLink
  }
}

describe('CreateNewUserLinkData', () => {
  test('Ensure CreateNewUserLinkData calls DbCreateFirsAccessLink with user and link', async () => {
    const { sut, dbCreateFirsAccessLink } = makeSut()
    const createSpy = jest.spyOn(dbCreateFirsAccessLink, 'createLink')
    await sut.create('any_id')
    expect(createSpy).toHaveBeenCalledWith('any_id', fakeString)
  })
  test('Should return recover link if RecoverPasswordData', async () => {
    const { sut } = makeSut()
    const link = await sut.create('any_id')
    expect(link).toEqual(fakeString)
  })
})
