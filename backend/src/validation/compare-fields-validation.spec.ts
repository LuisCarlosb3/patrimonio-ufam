import { InvalidParamError } from '@/presentation/protocols/helpers/errors'
import CompareFieldValidation from './compare-fields-validation'

function makeSut (): CompareFieldValidation {
  return new CompareFieldValidation('field', 'fieldToCompare')
}

describe('Required Field Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const response = sut.validate({ field: 'any-value', fieldToCompare: 'other-value' })
    expect(response).toEqual(new InvalidParamError('field'))
  })
  test('Shouldn\'t return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any-value', fieldToCompare: 'any-value' })
    expect(error).toBeFalsy()
  })
})
