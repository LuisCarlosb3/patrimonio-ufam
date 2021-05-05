import EmailValidator from '@/validation/protocols/email-validator'
import validation from 'validator'
export default class EmailValidationAdapter implements EmailValidator {
  isValid (email: string): boolean {
    const isValid = validation.isEmail(email)
    return isValid
  }
}
