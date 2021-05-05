import { Validation } from '@/presentation/protocols/validation'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'

export default class PermissionFieldValidation implements Validation {
  constructor (private readonly enumName: any, private readonly enumData: any) {
    this.enumName = enumName
    this.enumData = enumData
  }

  validate (input: any): Error {
    if (!this.enumData[input[this.enumName]]) {
      return new InvalidParamError(this.enumName)
    }
  }
}
