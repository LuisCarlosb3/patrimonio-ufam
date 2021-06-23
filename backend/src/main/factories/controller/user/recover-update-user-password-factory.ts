import { RecoverLink } from '@/infra/db/repositories/recover-link'
import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { RecoverUpdatePasswordController } from '@/presentation/controllers/user/update-password-controller'
import { HttpController } from '@/presentation/protocols/http-controller'
import { buildCheckRecoverPasswordData } from '../../usecases/user/recover-password/check-user-recover-password'
import { makeUpdatePasswordData } from '../../usecases/user/recover-password/update-password-factory'

export function makeRecoverUpdateUserPasswordFactory (): HttpController {
  const rules = {
    password: 'required|confirmed',
    password_confirmation: 'required',
    link: 'required'
  }
  const validator = new ValidatorJsAdapter(rules)
  const checkLink = buildCheckRecoverPasswordData()
  const updatePassword = makeUpdatePasswordData()
  const deleteLink = new RecoverLink()
  return new RecoverUpdatePasswordController(validator, checkLink, updatePassword, deleteLink)
}
