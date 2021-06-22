import { DbCheckIfCodeExists } from '@/data/protocols/db/responsability-statement/db-check-if-code-exists'
import { DbCreateResponsabilityStatement, InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { DbLoadStatementItem } from '@/data/protocols/db/responsability-statement/db-load-statement-item'
import { DbLoadResponsabilityStatementList } from '@/data/protocols/db/responsability-statement/db-load-statements-list'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { PatrimonyStatementItem } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'
import knex from '@/infra/db/helper/index'

export class ResponsabilityStatementRespositoy implements DbCreateResponsabilityStatement,
   DbLoadStatementItem, DbCheckIfCodeExists, DbLoadResponsabilityStatementList {
  private readonly tableName = 'responsability_statement'
  private readonly itensTableName = 'responsability_statement_itens'
  private readonly itensTableNameMapper = {
    id: 'id',
    patrimonyId: 'patrimony_id',
    responsabilityStatementId: 'statement_id'
  }

  private readonly statementTableNameMapper = {
    id: 'id',
    code: 'code',
    responsibleName: 'responsible_name',
    siapeCode: 'siape',
    emissionDate: 'emission_date'
  }

  async verifyCode (code: string): Promise<boolean> {
    const [{ count }] = await knex(this.tableName).where({ code }).count('id')
    return (count > 0)
  }

  async load (page: number, quantityPeerPage: number): Promise<ResponsabilityStatement[]> {
    const baseData = await knex(this.tableName).select(this.statementTableNameMapper)
      .limit(quantityPeerPage).offset(page)
    const statements = []
    for await (const item of baseData) {
      const id = item.id
      const patrimonies = []
      const data = await knex(this.itensTableName).where({ statement_id: id })
        .rightJoin('patrimony', `${this.itensTableName}.patrimony_id`, 'patrimony.id')
      for (const item of data) {
        patrimonies.push({
          id: item.patrimony_id,
          code: item.code,
          description: item.description,
          state: item.state,
          entryDate: item.entry_date,
          lastConferenceDate: item.last_conference_date,
          value: item.value
        })
      }
      const payload = {
        ...item,
        patrimonies
      }
      statements.push(payload)
    }
    return statements
  }

  async loadByPatrimonyId (patrimonyId: string): Promise<PatrimonyStatementItem> {
    const [item] = await knex(this.itensTableName).select(this.itensTableNameMapper).where({ patrimony_id: patrimonyId })
    if (item) {
      const [statement] = await knex(this.tableName).select(this.statementTableNameMapper).where({ id: item.responsabilityStatementId })
      return {
        ...statement,
        patrimonyId: item.patrimonyId
      }
    }
    return null
  }

  async create (newStatement: InsertNewStatementModel): Promise<void> {
    const { responsibleName, siapeCode, emissionDate, code, patrimoniesIds } = newStatement

    await knex.transaction(async trx => {
      try {
        const [newId] = await knex(this.tableName).transacting(trx).insert({
          responsible_name: responsibleName,
          code,
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
