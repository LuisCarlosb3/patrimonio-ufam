import { NodemailerHelper as sut } from '@/infra/email/helper/nodemailer-helper'
let testAccount: {user: string, email: string, pass: string}
let fakeTransporter: object
jest.mock('nodemailer', () => ({
  createTransport (transporter: object) {
    return {
      sendMail: jest.fn()
    }
  }
}))
describe('Nodemailer Helper', () => {
  beforeAll(async () => {
    testAccount = { user: 'any_user', email: 'any_email', pass: 'any_pass' }
    fakeTransporter = {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    }
  })
  test('Should create Transporter', async () => {
    sut.createTransporter(fakeTransporter, testAccount.user)
    expect(sut.transporter).not.toBeNull()
  })
  test('Should call Transporter send email correctly', async () => {
    const sendMailSpy = jest.spyOn(sut.transporter, 'sendMail')
    await sut.sendEmail('destinatario', 'destinatario@test', 'testing')
    expect(sendMailSpy).toHaveBeenCalledWith({
      from: testAccount.user,
      to: 'destinatario@test',
      subject: 'destinatario',
      html: 'testing'
    })
  })
})
