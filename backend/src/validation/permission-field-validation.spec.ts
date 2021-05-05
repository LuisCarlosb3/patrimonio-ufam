import { InvalidParamError } from '@/presentation/protocols/helpers/errors'
import PermissionFieldValidation from './permission-filed-validation'
import { Permission } from '@/domain/model/operator'

function makeSut (enumName: string, enumField: any): PermissionFieldValidation {
  return new PermissionFieldValidation(enumName, enumField)
}
describe('PermissionFieldValidation', () => {
  test('Should return Invalid Param Error on invalid permission', () => {
    const sut = makeSut('permission', Permission)
    const response = sut.validate({ permission: 'ANYPERM' })
    expect(response).toEqual(new InvalidParamError('permission'))
  })
  test('Should return false on valid permission', () => {
    const sut = makeSut('permission', Permission)
    const response = sut.validate({ permission: 'BLOCKED' })
    expect(response).toBeFalsy()
  })
})
