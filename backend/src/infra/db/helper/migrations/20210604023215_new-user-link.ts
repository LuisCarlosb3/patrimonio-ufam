import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema.createTable('new-user-link', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('user_id').notNullable().index().references('id').inTable('users')
    table.string('link').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('new-user-link')
}
