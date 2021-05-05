import { Validation } from '@/presentation/protocols/validation'
import { InvalidParamError, MissingParamError } from '@/presentation/protocols/helpers/errors'
import { ValidationComposite } from './validation-composite'
function makeValidatorStub (): Validation {
  class ValidatorStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}
interface SutTypes {
  sut: Validation
  validatorsStub: Validation[]
}
function makeSut (): SutTypes {
  const validatorsStub = [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidationComposite(validatorsStub)
  return {
    sut,
    validatorsStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[1], 'validate').mockImplementationOnce(() => {
      return new InvalidParamError('field')
    })
    const response = sut.validate({ field: 'any_name' })
    expect(response).toEqual(new InvalidParamError('field'))
  })
  test('Should return a first error on more then one validation fails', () => {
    const { sut, validatorsStub } = makeSut()
    jest.spyOn(validatorsStub[0], 'validate').mockImplementationOnce(() => { return new InvalidParamError('field') })
    jest.spyOn(validatorsStub[1], 'validate').mockImplementationOnce(() => { return new MissingParamError('field') })
    const response = sut.validate({ field: 'any_name' })
    expect(response).toEqual(new InvalidParamError('field'))
  })
  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
