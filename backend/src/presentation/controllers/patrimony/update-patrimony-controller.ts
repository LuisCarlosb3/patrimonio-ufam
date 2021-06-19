import { CheckPatrimonyIdAndCodeToUpdate } from '@/domain/usecase/patrimony/check-patrimony-id-and-code'
import { UpdatePatrimonyById } from '@/domain/usecase/patrimony/update-patrimony-by-id'
import { LoadUserById } from '@/domain/usecase/user/load-user-by-id'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class UpdatePatrimonyController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly loadUserById: LoadUserById,
    private readonly updatePatrimonyById: UpdatePatrimonyById,
    private readonly checkPatrimonyIdAndCode: CheckPatrimonyIdAndCodeToUpdate
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest.body)
      if (isValid) {
        return badRequest(isValid)
      }
      const { patrimony, accountId } = httpRequest.body

      const patrimonyLoaded = await this.checkPatrimonyIdAndCode.verifyPatrimony(patrimony.id, patrimony.code)
      if (!(patrimonyLoaded instanceof Error)) {
        const { permission } = await this.loadUserById.load(accountId)
        await this.updatePatrimonyById.updateById(permission, patrimony)
        return noContent()
      } else {
        return badRequest(patrimonyLoaded)
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
