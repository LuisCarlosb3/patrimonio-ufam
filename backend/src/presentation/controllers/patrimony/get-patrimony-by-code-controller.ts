import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, notFound, responseSuccess, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class GetPatrimonyByCodeController implements HttpController {
  constructor (
    private readonly loadPatrimony: LoadPatrimonyByCode,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest.params)
      if (isValid) {
        return badRequest(isValid)
      }
      const { code } = httpRequest.params
      const patrimony = await this.loadPatrimony.loadByCode(code)
      if (patrimony) {
        return responseSuccess({ patrimony })
      } else {
        return notFound(new PatrimonyNotFound())
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
