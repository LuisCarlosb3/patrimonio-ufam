import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.alterTable('patrimony', (table) => {
    table.uuid('statement_id').index().references('id').inTable('responsability_statement')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.alterTable('patrimony', (table) => {
    table.dropColumn('statement_id')
  })
}
