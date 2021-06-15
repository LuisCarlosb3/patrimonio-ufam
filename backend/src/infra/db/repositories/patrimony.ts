import { DbCreateNewPatrimony } from '@/data/protocols/db/patrimony/db-create-new-patrimony'
import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import { DbLoadPatrimonyList } from '@/data/protocols/db/patrimony/db-load-patrimony-list'
import { Patrimony } from '@/domain/model/patrimony'
import { NewPatrimonyModel } from '@/domain/usecase/patrimony/create-patrimony'
import knex from '@/infra/db/helper/index'
export class PatrimonyRepository implements DbCheckPatrimonyByCode, DbCreateNewPatrimony, DbLoadPatrimonyList {
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

  async checkByCode (code: string): Promise<string> {
    const patrimony = await knex(this.patrimonyTable).select('code').where({ code })
    if (patrimony.length > 0) {
      return patrimony[0].code
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
}
