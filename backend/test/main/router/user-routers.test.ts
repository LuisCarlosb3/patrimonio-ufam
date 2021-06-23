import request from 'supertest'
import server from '@/main/config/app'
import Env from '@/main/config/env'
import bcrypt from 'bcrypt'
import knex from '@/infra/db/helper/index'
import { User, UserPermission } from '@/domain/model/user'
import { sign } from 'jsonwebtoken'
const makeUser = (isAdmin?: boolean): Omit<User, 'id' | 'password'> => {
  const perm = isAdmin ? UserPermission.ADMINISTRATOR : UserPermission.INVENTORIOUS
  return {
    name: 'any_name',
    registration: 'myregistration',
    email: 'any@email.com',
    permission: perm
  }
}
const insertPayload = async (isAdmin?: boolean): Promise<string> => {
  const password = await bcrypt.hash('123456', 12)
  const user = makeUser(isAdmin)
  const userId = await knex('users').insert({ ...user, password }).returning('id')
  return userId[0]
}
const insertLink = async (userId: string): Promise<void> => {
  const linkData = {
    user_id: userId,
    link: 'any_link'
  }
  await knex('user-recover-link').insert(linkData)
}
const makeAccessToken = async (id: string, permission: UserPermission, isExpired?: boolean): Promise<string> => {
  const options = isExpired ? { expiresIn: '1ms' } : {}
  const accessToken = sign({ id, permission }, Env.jwtSecret, options)
  await knex('user-access-token').insert({
    user_id: id,
    token: accessToken
  })
  return accessToken
}
describe('Authentication Routes', () => {
  beforeAll(async done => {
    await knex.migrate.down()
    await knex.migrate.latest()
    done()
  })
  beforeEach(async () => {
    await knex('user-recover-link').del()
    await knex('user-access-token').del()
    await knex('users').del()
  })
  afterAll(async done => {
    await knex.migrate.down()
    await knex.destroy()
    done()
  })
  describe('/login', () => {
    test('Should return 200 on login', async () => {
      await insertPayload()
      await request(server).post('/login').send({
        registration: 'myregistration',
        password: '123456'
      }).expect(200)
    })
    test('Should return 401 on login with invalid password', async () => {
      await insertPayload()
      await request(server).post('/login').send({
        registration: 'myregistration',
        password: '654321'
      }).expect(403)
    })
    test('Should return 400 on login without password', async () => {
      await insertPayload()
      await request(server).post('/login').send({}).expect(400, { error: 'Invalid param: registration, password' })
    })
  })
  describe('/recover', () => {
    test('Should return 204 on recover password', async () => {
      await insertPayload()
      await request(server).post('/recover').send({
        registration: 'myregistration'
      }).expect(204)
    })
    test('Should return 400 on recover without registration', async () => {
      await insertPayload()
      await request(server).post('/recover').send({
        registration: ''
      }).expect(400)
    })
    test('Should return 401 on recover with unregistered user', async () => {
      await request(server).post('/recover').send({
        registration: 'myregistration'
      }).expect(401)
    })
    test('Should create a recover link to user on database', async () => {
      const userId = await insertPayload()
      await request(server).post('/recover').send({
        registration: 'myregistration'
      })
      const recoverLink = await knex('user-recover-link').where({ user_id: userId })
      expect(recoverLink).toBeTruthy()
    })
  })
  describe('GET /recover/link', () => {
    test('Should return 400 on access link with invalid link', async () => {
      await insertPayload()
      await request(server).get('/recover/link').expect(401)
    })
    test('Should return 200 on access link with valid link', async () => {
      const userId = await insertPayload()
      await insertLink(userId)
      await request(server).get('/recover/any_link').expect(204)
    })
  })
  describe('POST /recover/link', () => {
    test('Should return 400 on recover update password with wrong password confirmation', async () => {
      const userId = await insertPayload()
      await insertLink(userId)
      await request(server).post('/recover/any_link').send({
        password: 'newpassword',
        password_confirmation: 'wrongpassword'
      }).expect(400)
    })
    test('Should return 400 on recover update password without  password confirmation', async () => {
      const userId = await insertPayload()
      await insertLink(userId)
      await request(server).post('/recover/any_link').send({
        password: 'newpassword'
      }).expect(400)
    })
    test('Should return 400 on recover update password without password', async () => {
      const userId = await insertPayload()
      await insertLink(userId)
      await request(server).post('/recover/any_link').send({
        password_confirmation: 'wrongpassword'
      }).expect(400)
    })
    test('Should return 400 on recover update password with invalid link', async () => {
      await insertPayload()
      await request(server).post('/recover/wrong_link').send({
        password: 'newpassword',
        password_confirmation: 'newpassword'
      }).expect(401, { error: 'Unauthorized' })
    })
    test('Should return 201 on recover update password', async () => {
      const userId = await insertPayload()
      await insertLink(userId)
      await request(server).post('/recover/any_link').send({
        password: 'newpassword',
        password_confirmation: 'newpassword'
      }).expect(204)
      const [userData] = await knex('users').where({ id: userId })
      const passwordMatches = bcrypt.compareSync('newpassword', userData.password)
      expect(passwordMatches).toBeTruthy()
    })
  })
  describe('POST /users/create', () => {
    test('Should return 400 on crate user with invalid param ', async () => {
      const userId = await insertPayload(true)
      const accessToken = await makeAccessToken(userId, UserPermission.ADMINISTRATOR)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send({
          registration: 'valid_registration',
          email: 'newuser@email.com',
          permission: UserPermission.INVENTORIOUS,
          password: 'any_password'
        }).expect(400, { error: 'Invalid param: name' })
    })
    test('Should return 400 on crate user with small password', async () => {
      const userId = await insertPayload(true)
      const accessToken = await makeAccessToken(userId, UserPermission.ADMINISTRATOR)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send({
          registration: 'valid_registration',
          email: 'newuser@email.com',
          name: 'any_name',
          permission: UserPermission.INVENTORIOUS,
          password: '1234'
        }).expect(400, { error: 'Invalid param: password' })
    })
    test('Should return 400 on crate user with invalid permission ', async () => {
      const userId = await insertPayload(true)
      const accessToken = await makeAccessToken(userId, UserPermission.ADMINISTRATOR)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send({
          name: 'any_name',
          registration: 'valid_registration',
          email: 'newuser@email.com',
          permission: 5,
          password: 'any_password'
        }).expect(400, { error: 'Invalid param: permission' })
    })
    test('Should return 400 on crate user with aready registered email or registration', async () => {
      const userId = await insertPayload(true)
      const accessToken = await makeAccessToken(userId, UserPermission.ADMINISTRATOR)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send({
          name: 'any_name',
          registration: 'myregistration',
          email: 'any@email.com',
          permission: UserPermission.INVENTORIOUS,
          password: 'any_password'
        }).expect(400, { error: 'The received registration, email is already in use' })
    })
    test('Should return 203 on crate user on success', async () => {
      const userId = await insertPayload(true)
      const accessToken = await makeAccessToken(userId, UserPermission.ADMINISTRATOR)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send({
          name: 'new_name',
          registration: 'new_registration',
          email: 'new@email.com',
          permission: UserPermission.INVENTORIOUS,
          password: 'any_password'
        }).expect(204)
      const user = await knex('users').where({ email: 'new@email.com' })
      expect(user[0]).toBeTruthy()
      expect(user[0].registration).toEqual('new_registration')
      const isEqual = await bcrypt.compare('any_password', user[0].password)
      expect(isEqual).toBeTruthy()
    })
  })
  describe('Auth middleware', () => {
    test('Should return 403 on request router with invalid permission', async () => {
      const userId = await insertPayload(false)
      const accessToken = await makeAccessToken(userId, UserPermission.INVENTORIOUS)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send().expect(403, { error: 'Access denied' })
    })
    test('Should return 403 on expired token', async () => {
      const userId = await insertPayload(true)
      const accessToken = await makeAccessToken(userId, UserPermission.INVENTORIOUS, true)
      await request(server).post('/users/create')
        .set('x-access-token', accessToken)
        .send().expect(403, { error: 'Access denied' })
    })
    test('Should return 403 on none token set', async () => {
      await request(server).post('/users/create')
        .send().expect(403, { error: 'Access denied' })
    })
  })
})
