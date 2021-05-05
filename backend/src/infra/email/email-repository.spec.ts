import { NodemailerHelper } from './helper/nodemailer-helper'
import EmailRepository from './email-repository'
function makeSut (): EmailRepository {
  return new EmailRepository()
}
jest.mock('./helper/nodemailer-helper')
describe('EmailRepository', () => {
  test('Should sendRecover with correct values', async () => {
    const sut = makeSut()
    await sut.sendRecover('any@email.com', 'any_pass')
    expect(NodemailerHelper.sendEmail).toHaveBeenCalled()
  })
  test('Should sendNewPassword with correct values', async () => {
    const sut = makeSut()
    await sut.sendNewPassword('any@email.com', 'any_pass')
    expect(NodemailerHelper.sendEmail).toHaveBeenCalled()
  })
})
