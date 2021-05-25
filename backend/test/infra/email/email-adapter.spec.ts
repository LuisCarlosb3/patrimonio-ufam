import { NodemailerHelper } from '@/infra/email/helper/nodemailer-helper'
import { EmailSender } from '@/infra/email/email-adapter'
jest.mock('@/infra/email/helper/nodemailer-helper')
function makeSut (): EmailSender {
  return new EmailSender()
}
describe('EmailRepository', () => {
  test('Should sendRecover with correct values', async () => {
    const sut = makeSut()
    await sut.sendRecover('any@email.com', 'any_pass')
    expect(NodemailerHelper.sendEmail).toHaveBeenCalled()
  })
})
