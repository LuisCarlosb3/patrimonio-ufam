import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { CheckRecoverLinkController } from '@/presentation/controllers/user/check-recover-password-controller'
import { HttpController } from '@/presentation/protocols/http-controller'
import { buildCheckRecoverPasswordData } from '../../usecases/user/recover-password/check-user-recover-password'

export function CheckRecoverPasswordControllerFactory (): HttpController {
  const checkUserByLink = buildCheckRecoverPasswordData()
  const validator = new ValidatorJsAdapter({ link: 'required' })
  return new CheckRecoverLinkController(checkUserByLink, validator)
}
