import { EmailSender } from '@/infra/email/email-adapter'
import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { RecoverPasswordController } from '@/presentation/controllers/user/recover-password-controller'
import { HttpController } from '@/presentation/protocols/http-controller'
import { buildRecoverPasswordData } from '../../usecases/user/recover-password/recover-password-factory'

export function makeRecoverPasswordController (): HttpController {
  const validationRules = {
    registration: 'required'
  }
  const userAuth = buildRecoverPasswordData()
  const validatorJs = new ValidatorJsAdapter(validationRules)
  const sendRecover = new EmailSender()
  return new RecoverPasswordController(userAuth, validatorJs, sendRecover)
}
