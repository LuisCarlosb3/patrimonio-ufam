import { Validation } from '@/presentation/protocols/validation'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'

export default class LineFieldValidation implements Validation {
  constructor (private readonly enumName: any, private readonly enumData: any) {
    this.enumName = enumName
    this.enumData = enumData
  }

  validate (input: any): Error {
    const lines: string[] = []
    const linesInput = input[this.enumName]
    lines.push(linesInput)
    for (const line of lines) {
      if (!this.enumData[line] || typeof (this.enumData[line]) === 'undefined') {
        return new InvalidParamError(this.enumName)
      }
    }
    return null
  }
}
