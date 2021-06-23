import { ValidatorJsAdapter } from '@/infra/validation/validatorjs-adapter'
import { AuthenticationController } from '@/presentation/controllers/user/authentication-controller'
import { HttpController } from '@/presentation/protocols/http-controller'
import { buildAuthenticationData } from '../../usecases/user/user-authentication/user-authentication-factory'

export function makeAuthenticationController (): HttpController {
  const validationRules = {
    registration: 'required',
    password: 'required'
  }
  const userAuth = buildAuthenticationData()
  const validatorJs = new ValidatorJsAdapter(validationRules)
  return new AuthenticationController(userAuth, validatorJs)
}
