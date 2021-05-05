import { Validation } from '@/presentation/protocols/validation'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'

export default class FieldSizeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldSize: number
  ) {}

  validate (input: any): Error {
    if (input[this.fieldName].length <= this.fieldSize) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
