import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { LoadPatrimonyList } from '@/domain/usecase/patrimony/list-patrimony'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'

export class ListPatrimonyController implements HttpController {
  constructor (
    private readonly loadPatrimonyList: LoadPatrimonyList
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const page = (params?.page && params?.page >= 0) ? params.page : 0
      const patrimonyList = await this.loadPatrimonyList.load(page)
      return responseSuccess({ patrimonyList })
    } catch (error) {
      return serverError(error)
    }
  }
}
