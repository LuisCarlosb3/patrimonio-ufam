import { DbCheckIfPatrimonyExists } from '@/data/protocols/db/patrimony/db-check-if-patrimony-exists-by-id'
import { DbCreateNewPatrimony } from '@/data/protocols/db/patrimony/db-create-new-patrimony'
import { DbDeletePatrimonyById } from '@/data/protocols/db/patrimony/db-delete-patrimony-by-id'
import { DbDeletePatrimonyItenById } from '@/data/protocols/db/patrimony/db-delete-patrimony-itens-by-id'
import { DbInsertNewItensToPatrimony } from '@/data/protocols/db/patrimony/db-insert-new-itens-to-patrimony'
import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { DbLoadPatrimonyById } from '@/data/protocols/db/patrimony/db-load-patrimony-by-id'
import { DbLoadPatrimonyIdsByCodes } from '@/data/protocols/db/patrimony/db-load-patrimony-ids-by-codes'
import { DbLoadPatrimonyList } from '@/data/protocols/db/patrimony/db-load-patrimony-list'
import { DbUpdatePatrimonyById } from '@/data/protocols/db/patrimony/db-update-patrimony-by-id'
import { Patrimony } from '@/domain/model/patrimony'
import { NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'
import { NewItenToInsert } from '@/domain/usecase/patrimony/update-patrimony-by-id'
import knex from '@/infra/db/helper/index'
export class PatrimonyRepository implements DbCheckPatrimonyByCode, DbCreateNewPatrimony,
   DbLoadPatrimonyList, DbUpdatePatrimonyById, DbCheckIfPatrimonyExists, DbInsertNewItensToPatrimony,
   DbDeletePatrimonyItenById, DbLoadPatrimonyById, DbDeletePatrimonyById, DbLoadPatrimonyIdsByCodes {
  private readonly patrimonyTable = 'patrimony'
  private readonly itensTable = 'patrimony-itens'
  private readonly columnNameParser = {
    id: 'id',
    code: 'code',
    description: 'description',
    state: 'state',
    entryDate: 'entry_date',
    lastConferenceDate: 'last_conference_date',
    value: 'value'
  }

  async checkByCode (code: string): Promise<Patrimony> {
    const queryRes = await knex(this.patrimonyTable).select(this.columnNameParser).where({ code })
    if (queryRes.length > 0) {
      const patrimony = queryRes[0]
      const patrimonyItens = await knex(this.itensTable).where({ patrimony_id: patrimony.id })
      const patrimonyInstance = {
        ...patrimony,
        patrimonyItens
      }
      return patrimonyInstance
    }
    return null
  }

  async loadById (id: string): Promise<Patrimony> {
    const queryRes = await knex(this.patrimonyTable).select(this.columnNameParser).where({ id })
    if (queryRes.length > 0) {
      const patrimony = queryRes[0]
      const patrimonyItens = await knex(this.itensTable).where({ patrimony_id: patrimony.id })
      const patrimonyInstance = {
        ...patrimony,
        patrimonyItens
      }
      return patrimonyInstance
    }
    return null
  }

  async create (newPatrimony: NewPatrimonyModel): Promise<string> {
    const { patrimonyItens, ...patrimony } = newPatrimony
    const data = await knex.transaction(async trx => {
      try {
        const { entryDate, lastConferenceDate, ...data } = patrimony
        const [id] = await knex(this.patrimonyTable).transacting(trx).insert({
          entry_date: entryDate,
          last_conference_date: lastConferenceDate,
          ...data
        }).returning('id')
        const itens = patrimonyItens.map(item => ({ patrimony_id: id, ...item }))
        await knex(this.itensTable).transacting(trx).insert(itens)
        await trx.commit(id)
      } catch (error) {
        await trx.rollback()
        throw error
      }
    })
    return (data as any || null)
  }

  async load (page: number, quantityPeerPage: number): Promise<Patrimony[]> {
    const baseData = await knex(this.patrimonyTable).select(this.columnNameParser).limit(quantityPeerPage).offset(page)
    const patrimonies = []
    for await (const item of baseData) {
      const id = item.id
      const patrimonyItens = await knex(this.itensTable).where({ patrimony_id: id })
      const patrimonyInstance = {
        ...item,
        patrimonyItens
      }
      patrimonies.push(patrimonyInstance)
    }
    return patrimonies
  }

  async updateById (patrimony: Patrimony): Promise<void> {
    const patrimonyId = patrimony.id
    const { patrimonyItens, ...patrimonyData } = patrimony
    let res = null
    await knex.transaction(async trx => {
      try {
        const { entryDate, lastConferenceDate, code, description, state, value } = patrimonyData
        await knex(this.patrimonyTable).transacting(trx).update({
          code,
          description,
          state,
          entry_date: entryDate,
          last_conference_date: lastConferenceDate,
          value
        }).where({ id: patrimonyId })

        for await (const item of patrimonyItens) {
          const { name, localization, id, observation } = item
          await knex(this.itensTable).transacting(trx).update({
            name,
            localization,
            observation
          }).where({ id })
        }
        await trx.commit(patrimonyId)
        return null
      } catch (error) {
        await trx.rollback()
        res = error
      }
    })
    if (res) {
      throw (res)
    }
    return null
  }

  async verifyById (id: string): Promise<boolean> {
    const patrimony = await knex(this.patrimonyTable).select('id').where({ id })
    if (patrimony.length > 0) {
      return true
    }
    return false
  }

  async insertItens (patrimonyId: string, itens: NewItenToInsert[]): Promise<void> {
    const itensToInsert = itens.map(item => {
      return {
        patrimony_id: patrimonyId,
        ...item
      }
    })
    await knex(this.itensTable).insert(itensToInsert)
  }

  async deleteItensById (itenId: string | string[]): Promise<void> {
    if (Array.isArray(itenId)) {
      await knex(this.itensTable).whereIn('id', itenId).del()
    } else {
      await knex(this.itensTable).where({ id: itenId }).del()
    }
  }

  async deleteById (patrimonyId: string): Promise<void> {
    await knex(this.patrimonyTable).where('id', patrimonyId).del()
  }

  async loadByCodes (codes: string[]): Promise<string[]> {
    const patrimonies = await knex(this.patrimonyTable).select('id').whereIn('code', codes)
    const ids = patrimonies.map(item => item.id)
    return ids
  }
}
