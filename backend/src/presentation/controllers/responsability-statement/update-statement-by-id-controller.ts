import { LoadPatrimonyById } from '@/domain/usecase/patrimony/load-patrimony-by-id'
import { LoadStatementById } from '@/domain/usecase/responsability-statement/load-statement-by-id'
import { UpdateStatementById } from '@/domain/usecase/responsability-statement/update-statement-by-id'
import { PatrimonyHasStatement, PatrimonyNotFound, StatementNotFound } from '@/presentation/protocols/helpers/errors'
import { badRequest, noContent, serverError } from '@/presentation/protocols/helpers/http-helpers'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { HttpController } from '@/presentation/protocols/http-controller'
import { Validation } from '@/presentation/protocols/validation'

export class UpdateStatementController implements HttpController {
  constructor (
    private readonly validator: Validation,
    private readonly updateStatementById: UpdateStatementById,
    private readonly loadPatrimonyById: LoadPatrimonyById,
    private readonly loadStatementById: LoadStatementById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isValid = this.validator.validate(httpRequest.body)
      if (isValid) {
        return badRequest(isValid)
      }
      const { statement } = httpRequest.body
      const loadedStatement = await this.loadStatementById.loadById(statement.id)
      if (!loadedStatement) {
        return badRequest(new StatementNotFound())
      }
      const { removedPatrimonies, addedPatrimonies } = statement
      const patrimonies = [...removedPatrimonies, ...addedPatrimonies]
      for await (const patrimonyId of patrimonies) {
        const patrimony = await this.loadPatrimonyById.laodById(patrimonyId)
        if (!patrimony) {
          return badRequest(new PatrimonyNotFound(patrimonyId))
        }
        if (patrimony.statementCode && patrimony.statementCode !== loadedStatement.code) {
          return badRequest(new PatrimonyHasStatement(patrimony.code))
        }
      }
      await this.updateStatementById.updateById(statement)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
