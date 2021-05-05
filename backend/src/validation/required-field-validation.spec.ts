import { MissingParamError } from '@/presentation/protocols/helpers/errors'
import RequiredFieldValidation from './required-field-validation'

function makeSut (): RequiredFieldValidation {
  return new RequiredFieldValidation('field')
}

describe('Required Field Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = makeSut()
    const response = sut.validate({})
    expect(response).toEqual(new MissingParamError('field'))
  })
  test('Shouldn\'t return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
