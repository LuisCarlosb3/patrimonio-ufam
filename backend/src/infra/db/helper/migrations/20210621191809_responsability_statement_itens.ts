import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('responsability_statement_itens', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.uuid('statement_id').notNullable().index().references('id').inTable('responsability_statement').onDelete('CASCADE')
    table.uuid('patrimony_id').notNullable().unique().index().references('id').inTable('patrimony')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('responsability_statement_itens')
}
