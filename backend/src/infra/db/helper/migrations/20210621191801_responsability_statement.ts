import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema.createTable('responsability_statement', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
    table.string('code', 14).notNullable().unique()
    table.string('responsible_name', 100).notNullable()
    table.string('siape', 100).notNullable()
    table.date('emission_date').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema.dropTable('responsability_statement')
}
