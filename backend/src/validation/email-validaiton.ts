import { Validation } from '@/presentation/protocols/validation'
import EmailValidator from './protocols/email-validator'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'

export default class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    const response = this.emailValidator.isValid(input[this.fieldName])
    if (!response) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
