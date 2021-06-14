import { DbLoadPatrimonyList } from '@/data/protocols/db/patrimony/db-load-patrimony-list'
import { Patrimony } from '@/domain/model/patrimony'
import { LoadPatrimonyList } from '@/domain/usecase/patrimony/list-patrimony'

export class LoadPatrimonyListData implements LoadPatrimonyList {
  constructor (
    private readonly loadpatrimony: DbLoadPatrimonyList
  ) {}

  async load (page?: number): Promise<Patrimony[]> {
    const quantityPeerPage = 10
    const pageToQuery = (page && page >= 0) ? (page * quantityPeerPage) : 0
    const patrimonyList = await this.loadpatrimony.load(pageToQuery, quantityPeerPage)
    return patrimonyList
  }
}
