import { Validation } from '@/presentation/protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validators: Validation[]) {}
  validate (input: any): Error {
    for (const validator of this.validators) {
      const response = validator.validate(input)
      if (response) {
        return response
      }
    }
    return null
  }
}
