import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { LoadUserList } from '@/domain/usecase/user/list-user'
import { LoadUserCount } from '@/domain/usecase/user/load-user-count'

export class ListUsersController implements HttpController {
  constructor (
    private readonly loadUserList: LoadUserList,
    private readonly loadUserCount: LoadUserCount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const params = httpRequest.params
      const page = (params?.page && params?.page >= 0) ? params.page : 0
      const userPeerPage = 10
      const totalUsers = await this.loadUserCount.count()
      let userList = []
      if (totalUsers > 0) {
        userList = await this.loadUserList.load(page)
      }
      const totalPages = Math.ceil(totalUsers / userPeerPage)
      const actualPage = parseInt(page) + 1
      return responseSuccess({
        userList,
        totalUsers,
        actualPage,
        totalPages,
        userPeerPage
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
