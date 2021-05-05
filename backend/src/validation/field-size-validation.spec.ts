import { InvalidParamError } from '@/presentation/protocols/helpers/errors'
import FieldSizeValidation from './field-size-validation'

function makeSut (): FieldSizeValidation {
  return new FieldSizeValidation('field', 6)
}
describe('FieldSizeValidation', () => {
  test('Should return Invalid Param Error if password is too short', () => {
    const sut = makeSut()
    const response = sut.validate({ field: 'wrong' })
    expect(response).toEqual(new InvalidParamError('field'))
  })
  test('Should return false if password isn\'t too short', () => {
    const sut = makeSut()
    const response = sut.validate({ field: 'bighest' })
    expect(response).toBeFalsy()
  })
})
