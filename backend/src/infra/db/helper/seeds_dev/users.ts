import { Knex } from 'knex'
import bcrypt from 'bcrypt'
export async function seed (knex: Knex): Promise<void> {
  await knex('user-recover-link').del()
  await knex('user-access-token').del()
  await knex('users').del()
  const hash = await bcrypt.hash('123456', 12)
  const admin = {
    name: 'administrator',
    registration: '123456',
    email: 'admin@email.com',
    password: hash,
    permission: 2
  }
  const user = {
    name: 'inventariante',
    registration: '654321',
    email: 'inventariante@email.com',
    password: hash,
    permission: 1
  }
  // Inserts seed entries
  await knex('users').insert([admin, user])
};
