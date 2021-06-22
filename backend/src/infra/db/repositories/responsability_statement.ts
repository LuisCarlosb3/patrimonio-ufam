import { DbCreateResponsabilityStatement, InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { DbLoadStatementItem } from '@/data/protocols/db/responsability-statement/db-load-statement-item'
import { StatementItem } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'
import knex from '@/infra/db/helper/index'

export class ResponsabilityStatementRespositoy implements DbCreateResponsabilityStatement, DbLoadStatementItem {
  private readonly tableName = 'responsability_statement'
  private readonly itensTableName = 'responsability_statement_itens'
  private readonly itensTableNameMapper = {
    patrimonyId: 'patrimony_id',
    responsabilityStatementId: 'statement_id'
  }

  async loadByPatrimonyId (patrimonyId: string): Promise<StatementItem> {
    const item = await knex(this.itensTableName).select(this.itensTableNameMapper).where({ patrimony_id: patrimonyId })
    return item[0] || null
  }

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
        throw error
      }
    })
  }
}
