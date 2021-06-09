import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema.createTable('patrimony-item', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('patrimony_id').notNullable().index().references('id').inTable('patrimony').onDelete('CASCADE')
    table.string('name', 100).notNullable()
    table.string('localization', 100).notNullable()
    table.text('observation')
  })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('patrimony-item')
}
