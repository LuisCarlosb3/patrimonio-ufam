import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"')
  return await knex.schema.createTable('patrimony', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('code', 50).notNullable()
    table.text('description').notNullable()
    table.string('state', 20).notNullable()
    table.date('entry_date').notNullable()
    table.date('last_conference_date').notNullable()
    table.double('value', 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('patrimony')
}
