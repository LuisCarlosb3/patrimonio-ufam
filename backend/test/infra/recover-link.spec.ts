import { User, UserPermission } from '@/domain/model/user'
import knex from '@/infra/db/helper/index'
import { RecoverLink } from '@/infra/db/repositories/recover-link'
const makeUser = (): Omit<User, 'id'> => {
  return {
    name: 'any_name',
    registration: 'any_registration',
    email: 'any@email.com',
    password: 'any_hash',
    permission: UserPermission.INVENTORIOUS
  }
}
const insertUser = async (): Promise<string> => {
  const user = makeUser()
  const userId = await knex('users').insert(user).returning('id')
  return userId[0]
}
const insertLink = async (userId: string): Promise<string> => {
  const linkData = {
    user_id: userId,
    link: 'any_link'
  }
  const [linkId] = await knex('user-recover-link').insert(linkData).returning('id')
  return linkId
}
describe('User Postgres Repository', () => {
  beforeAll(async done => {
    await knex.migrate.latest()
    done()
  })
  beforeEach(async (done) => {
    await knex('user-recover-link').del()
    await knex('user-access-token').del()
    await knex('users').del()
    done()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  const makeSut = (): RecoverLink => {
    return new RecoverLink()
  }
  test('Ensure RecoverLink create user recover link', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    const res = await sut.update(userId, 'any_hash')
    expect(res).toBeTruthy()
    const link = await knex('user-recover-link').where({ link: 'any_hash' })
    expect(link[0]).toBeTruthy()
    expect(link[0].user_id).toEqual(userId)
  })
  test('Ensure RecoverLink returns link if user link exists', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    await insertLink(userId)
    const res = await sut.loadByLink('any_link')
    expect(res).toBeTruthy()
    expect(res.userId).toEqual(userId)
  })
  test('Ensure RecoverLink returns null if user link not exists', async () => {
    const sut = makeSut()
    const res = await sut.loadByLink('any_link')
    expect(res).toBeNull()
  })
  test('Ensure RecoverLink remove user link on search by id', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    const linkId = await insertLink(userId)
    await sut.deleteById(linkId)
    const link = await knex('user-recover-link').where({ id: linkId })
    expect(link[0]).toBeFalsy()
  })
  test('Ensure RecoverLink remove user link on search by link', async () => {
    const sut = makeSut()
    const userId = await insertUser()
    await insertLink(userId)
    await sut.deleteByLink('any_link')
    const link = await knex('user-recover-link').where({ link: 'any_link' })
    expect(link[0]).toBeFalsy()
  })
})
