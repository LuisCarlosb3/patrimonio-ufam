import SendNewUserAccessLink from '@/data/protocols/email/send-new-user-link'
import SendRecoverPasswordEmail from '@/data/protocols/email/send-recover-password'
import Env from '@/main/config/env'
import { NodemailerHelper } from './helper/nodemailer-helper'
export class EmailSender implements SendRecoverPasswordEmail, SendNewUserAccessLink {
  async sendNewNewUserNotify (email: string): Promise<void> {
    const message = `
    <html><h2>Bem-vindo ao Oráculo</h2>
      <p>
        Verifique com o administrador responsável para obter sua senha de acesso 
      </p>
    </html>
    `
    await NodemailerHelper.sendEmail('Oráculo - First Access', email, message)
  }

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
