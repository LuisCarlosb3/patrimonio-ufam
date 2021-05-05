import EmailValidator from './protocols/email-validator'
import EmailValidation from './email-validaiton'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'
function makeEmailValidatorStub (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}
function makeSut (): SutTypes {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}
describe('Email Validation', () => {
  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email')
  })
  test('Should return an error if email validator fails', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const response = sut.validate({ email: 'any_email' })
    expect(response).toEqual(new InvalidParamError('email'))
  })
  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
