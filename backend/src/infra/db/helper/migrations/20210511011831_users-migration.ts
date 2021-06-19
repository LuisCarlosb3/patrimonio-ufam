import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"')
  return await knex.schema.createTable('users', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('name', 255).notNullable()
    table.string('registration', 20).notNullable()
    table.string('email', 100).notNullable()
    table.string('password').notNullable()
    table.integer('permission').notNullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  return await knex.raw('drop extension if exists "uuid-ossp"')
}
