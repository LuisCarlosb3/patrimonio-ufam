import EmailValidationAdapter from './email-validation-adapter'
import validation from 'validator'
jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
function makeSut (): EmailValidationAdapter {
  return new EmailValidationAdapter()
}
describe('Email validation Adapter', () => {
  test('Should return false if EmailValidation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validation, 'isEmail').mockReturnValueOnce(false)
    const response = sut.isValid('email@email')
    expect(response).toBeFalsy()
  })
  test('Should return true if EmailValidation returns true', () => {
    const sut = makeSut()
    jest.spyOn(validation, 'isEmail').mockReturnValueOnce(true)
    const response = sut.isValid('email@email')
    expect(response).toBeTruthy()
  })
  test('Should call validation with correct email', () => {
    const sut = makeSut()
    const response = sut.isValid('email@email')
    expect(response).toBeTruthy()
  })
})
