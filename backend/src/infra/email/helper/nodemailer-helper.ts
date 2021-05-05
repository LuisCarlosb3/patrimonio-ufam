import { Transporter, createTransport } from 'nodemailer'

export const NodemailerHelper = {
  transporter: null as Transporter,
  emailSender: null as string,
  createTransporter (transporter: object, email: string) {
    if (!this.transporter) {
      this.emailSender = email
      this.transporter = createTransport(transporter)
    }
  },
  async sendEmail (emailSubject: string, recipientEmail: string, bodyMessage: string): Promise<void> {
    if (this.transporter) {
      await this.transporter.sendMail({
        from: this.emailSender,
        to: recipientEmail,
        subject: emailSubject,
        html: bodyMessage
      })
    }
  }
}
