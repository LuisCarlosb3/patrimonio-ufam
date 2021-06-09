import { DbCheckPatrimonyByCode } from '@/data/protocols/db/patrimony/db-load-patrimony-by-code'
import knex from '@/infra/db/helper/index'
export class PatrimonyRepository implements DbCheckPatrimonyByCode {
  private readonly patrimonyTable = 'patrimony'
  private readonly itensTable = 'patrimony-itens'
  async checkByCode (code: string): Promise<string> {
    const patrimony = await knex(this.patrimonyTable).select('code').where({ code })
    if (patrimony.length > 0) {
      return patrimony[0].code
    }
    return null
  }
}
