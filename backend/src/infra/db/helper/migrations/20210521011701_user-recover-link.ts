import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('user-recover-link', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('user_id').notNullable().index().references('id').inTable('users')
    table.string('link').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('expires_at').defaultTo((knex.raw('? + INTERVAL \'? hour\'', [knex.fn.now(), 1])))
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('user-recover-link')
}
