import SendRecoverPasswordEmail from '@/data/protocols/email/send-recover-password'
import Env from '@/main/config/env'
import { NodemailerHelper } from './helper/nodemailer-helper'
export class EmailSender implements SendRecoverPasswordEmail {
  async sendRecover (email: string, newPasswordLink: string): Promise<void> {
    const message = `
    <html><h2>Recuperação de senha</h2>
      <p>
        Para recuperar sua senha acesse o seguinte link: ${Env.hostname}/recover/${newPasswordLink} 
      </p>
    </html>
    `
    await NodemailerHelper.sendEmail('Password Recovery', email, message)
  }
}
