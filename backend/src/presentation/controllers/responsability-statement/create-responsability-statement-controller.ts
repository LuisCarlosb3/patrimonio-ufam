import { LoadPatrimonyByCode } from '@/domain/usecase/patrimony/load-patrimony-by-code'
import { CheckIfPatrimonyStatementExists } from '@/domain/usecase/responsability-statement/check-patrimony-statement-exists'
import { CreateResponsabilityStatement } from '@/domain/usecase/responsability-statement/create-responsability-statement'
import { PatrimonyHasStatement, PatrimonyNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class CreateResponsabilityStatementController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly loadByCode: LoadPatrimonyByCode,
    private readonly loadStatementItem: CheckIfPatrimonyStatementExists,
    private readonly createStatement: CreateResponsabilityStatement
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationErr = this.validator.validate(httpRequest.body)
      if (validationErr) {
        return badRequest(validationErr)
      }
      const { responsibleName, siapeCode, emissionDate, patrimoniesCode } = httpRequest.body.newStatement
      for await (const code of patrimoniesCode) {
        const patrimony = await this.loadByCode.loadByCode(code)
        if (!patrimony) {
          return badRequest(new PatrimonyNotFound(code))
        }
        const item = await this.loadStatementItem.loadStatement(patrimony.id)
        if (item) {
          return badRequest(new PatrimonyHasStatement(code))
        }
      }
      await this.createStatement.create({ responsibleName, siapeCode, emissionDate, patrimoniesCode })
    } catch (error) {
      return serverError(error)
    }
  }
}
