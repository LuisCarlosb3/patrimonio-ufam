import { CreateNewPatrimony } from '@/domain/usecase/patrimony/create-patrimony'
import { ValueInUseError } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class CreateNewpatrimonyController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly createNewPatrimony: CreateNewPatrimony
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const validationError = this.validator.validate(body)
      if (validationError) {
        return badRequest(validationError)
      }
      const { code, description, state, entryDate, lastConferenceDate, value, patrimonyItens } = body
      const response = await this.createNewPatrimony.create({ code, description, state, entryDate, lastConferenceDate, value, patrimonyItens })
      if (response) {
        return noContent()
      }
      return badRequest(new ValueInUseError(['code']))
    } catch (error) {
      return serverError(error)
    }
  }
}
