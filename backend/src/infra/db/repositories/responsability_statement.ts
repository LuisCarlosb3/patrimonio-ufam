import { DbCheckIfCodeExists } from '@/data/protocols/db/responsability-statement/db-check-if-code-exists'
import { DbCreateResponsabilityStatement, InsertNewStatementModel } from '@/data/protocols/db/responsability-statement/db-create-statement'
import { DbLoadStatementItem } from '@/data/protocols/db/responsability-statement/db-load-statement-item'
import { DbLoadResponsabilityStatementList, DbLoadResponsabilityStatementListFiltered } from '@/data/protocols/db/responsability-statement/db-load-statements-list'
import { ResponsabilityStatement } from '@/domain/model/responsability-statement'
import { PatrimonyStatementItem } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'
import { PatrimonyRepository } from './patrimony'
import knex from '@/infra/db/helper/index'
import { PatrimonyHasStatement } from '@/presentation/protocols/helpers/errors'
import { DbLoadStatementById } from '@/data/protocols/db/responsability-statement/db-load-statement-by-id'

export class ResponsabilityStatementRespositoy implements DbCreateResponsabilityStatement,
   DbLoadStatementItem, DbCheckIfCodeExists, DbLoadResponsabilityStatementList, DbLoadResponsabilityStatementListFiltered,
   DbLoadStatementById {
  private readonly tableName = 'responsability_statement'
  private readonly patrimonyRepository = new PatrimonyRepository()
  private readonly patrimonyTable = 'patrimony'
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
      const patrimonies = await this.patrimonyRepository.loadByStatementId(id)
      const payload: ResponsabilityStatement = {
        ...item,
        patrimonies
      }
      statements.push(payload)
    }
    return statements
  }

  async loadByPatrimonyId (patrimonyId: string): Promise<PatrimonyStatementItem> {
    const [{ statementId }] = await knex(this.patrimonyTable)
      .select({ statementId: 'statement_id' }).where({ id: patrimonyId })
    if (statementId) {
      const [statement] = await knex(this.tableName)
        .select(this.statementTableNameMapper)
        .where({ id: statementId })
      return {
        ...statement,
        patrimonyId: patrimonyId
      }
    }
    return null
  }

  async create (newStatement: InsertNewStatementModel): Promise<void> {
    const { responsibleName, siapeCode, emissionDate, code, patrimoniesIds } = newStatement
    for await (const patrimonyId of patrimoniesIds) {
      const patrimony = await this.patrimonyRepository.loadById(patrimonyId)
      if (patrimony.statementCode) {
        throw new PatrimonyHasStatement(patrimony.code)
      }
    }
    const [statementId] = await knex(this.tableName).insert({
      responsible_name: responsibleName,
      code,
      siape: siapeCode,
      emission_date: emissionDate
    }).returning('id')

    await this.patrimonyRepository.updateStatement(patrimoniesIds, statementId)
  }

  async loadByCodeOrSiape (filter: string, page: number, quantityPeerPage: number): Promise<ResponsabilityStatement[]> {
    const baseData = await knex(this.tableName).select(this.statementTableNameMapper)
      .where('code', 'like', `%${filter}%`)
      .orWhere('siape', 'like', `%${filter}%`)
      .limit(quantityPeerPage).offset(page)
    const statements = []
    for await (const item of baseData) {
      const id = item.id
      const patrimonies = await this.patrimonyRepository.loadByStatementId(id)
      const payload: ResponsabilityStatement = {
        ...item,
        patrimonies
      }
      statements.push(payload)
    }
    return statements
  }

  async loadById (id: string): Promise<ResponsabilityStatement> {
    const baseData = await knex(this.tableName).select(this.statementTableNameMapper).where({ id })
    if (baseData.length > 0) {
      const payload = await this.loadPatrimonies(baseData[0])
      return payload
    }
    return null
  }

  private async loadPatrimonies (baseStatementInfo: Omit<ResponsabilityStatement, 'patrimonies'>): Promise<ResponsabilityStatement> {
    const id = baseStatementInfo.id
    const patrimonies = await this.patrimonyRepository.loadByStatementId(id)
    const payload: ResponsabilityStatement = {
      ...baseStatementInfo,
      patrimonies
    }
    return payload
  }
}
