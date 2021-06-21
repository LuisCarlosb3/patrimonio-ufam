import { DbCreateStatementResponsability, InsertNewStatementModel } from '@/data/protocols/db/statement-responsability/db-create-statement'
import knex from '@/infra/db/helper/index'

export class ResponsabilityStatementRespositoy implements DbCreateStatementResponsability {
  private readonly tableName = 'responsability_statement'
  private readonly itensTableName = 'responsability_statement_itens'
  async create (newStatement: InsertNewStatementModel): Promise<void> {
    const { responsibleName, siapeCode, emissionDate, patrimoniesIds } = newStatement

    await knex.transaction(async trx => {
      try {
        const [newId] = await knex(this.tableName).transacting(trx).insert({
          responsible_name: responsibleName,
          siape: siapeCode,
          emission_date: emissionDate
        }).returning('id')
        const itens = patrimoniesIds.map(item => ({
          patrimony_id: item,
          statement_id: newId
        }))
        await knex(this.itensTableName).transacting(trx).insert(itens)
        await trx.commit()
      } catch (error) {
        await trx.rollback()
        console.log(error)
        throw error
      }
    })
  }
}
