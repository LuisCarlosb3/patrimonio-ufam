import SendRecoverPasswordEmail from '@/data/protocols/email/send-recover-password'
import { NodemailerHelper } from './helper/nodemailer-helper'
import SendNewPasswordEmail from '@/data/protocols/email/send-new-password'
export default class EmailRepository implements SendRecoverPasswordEmail, SendNewPasswordEmail {
  async sendRecover (email: string, newPassword: string): Promise<void> {
    const message = `
    <html><h2>ACCESS PASSWORD</h2>
      <p>
        Use this code: ${newPassword} to access your account 
      </p>
    </html>
    `
    await NodemailerHelper.sendEmail('Password Recovery', email, message)
  }

  async sendNewPassword (email: string, newPassword: string): Promise<void> {
    const message = `
    <html><h2>ACCESS PASSWORD</h2>
      <p>
        Use this code: ${newPassword} to access your account 
      </p>
    </html>
    `
    await NodemailerHelper.sendEmail('Password Recovery', email, message)
  }
}
