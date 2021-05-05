import { Validation } from '@/presentation/protocols/validation'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'

export default class CompareFieldsValidation implements Validation {
  constructor (
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  validate (input: any): Error {
    if (input[this.field] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.field)
    }
    return null
  }
}
