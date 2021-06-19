import { InvalidParamError } from '@/presentation/protocols/helpers/errors'
import { Validation } from '@/presentation/protocols/validation'
import Validator, { Rules } from 'validatorjs'
export class ValidatorJsAdapter implements Validation {
  constructor (private readonly rules: Rules) {}

  validate (input: object): Error {
    const validation = new Validator(input, this.rules)
    if (validation.passes()) {
      return null
    } else {
      const paramError = validation.errors.all()
      const keys = Object.keys(paramError)
      return new InvalidParamError([...keys])
    }
  }
}
