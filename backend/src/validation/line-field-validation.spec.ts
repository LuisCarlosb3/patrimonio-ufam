import LineFieldValidation from './line-field-validation'
import { Line } from '@/domain/model/operator'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'

function makeSut (enumName: string, enumField: any): LineFieldValidation {
  return new LineFieldValidation(enumName, enumField)
}
describe('PermissionFieldValidation', () => {
  test('Should return Invalid Param Error on invalid line', () => {
    const sut = makeSut('line', Line)
    const response = sut.validate({ line: ['any line'] })
    expect(response).toEqual(new InvalidParamError('line'))
  })
  test('Should return false on valid line', () => {
    const sut = makeSut('line', Line)
    const response = sut.validate({ line: ['NEWLAND'] })
    expect(response).toBeFalsy()
  })
})
