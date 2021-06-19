import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { InvalidParamError } from '@/presentation/protocols/helpers/errors'
import { Rules } from 'validatorjs'

describe('ValidatorJs Adapter', () => {
  const makeSut = (rules: Rules): ValidatorJsAdapter => {
    return new ValidatorJsAdapter(rules)
  }
  test('ValidatorJsAdapter should return null on validation succeeds', () => {
    const rules = {
      name: 'required',
      email: 'required|email',
      age: 'min:18'
    }
    const sut = makeSut(rules)
    const okayData = {
      name: 'any_name',
      email: 'any@email.com',
      age: 19
    }
    const response = sut.validate(okayData)
    expect(response).toBeNull()
  })
  test('ValidatorJsAdapter should returns an error validation fails', () => {
    const rules = {
      name: 'required',
      email: 'required|email',
      age: 'min:18'
    }
    const sut = makeSut(rules)
    const okayData = {
      name: 'any_name',
      email: 'anyemail.com',
      age: 17
    }
    const response = sut.validate(okayData)
    expect(response).toEqual(new InvalidParamError(['email', 'age']))
  })
})
