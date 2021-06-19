import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema.createTable('patrimony-itens', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('patrimony_id').notNullable().index().references('id').inTable('patrimony').onDelete('CASCADE')
    table.string('name', 100).notNullable()
    table.string('localization', 100).notNullable()
    table.text('observation')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('patrimony-itens')
}
