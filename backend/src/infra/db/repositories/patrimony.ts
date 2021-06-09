import { DbCreateNewPatrimony, NewPatrimonyModel } from '@/data/protocols/db/patrimony/db-create-new-patrimony'
import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import knex from '@/infra/db/helper/index'
export class PatrimonyRepository implements DbCheckPatrimonyByCode, DbCreateNewPatrimony {
  private readonly patrimonyTable = 'patrimony'
  private readonly itensTable = 'patrimony-itens'
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
}
