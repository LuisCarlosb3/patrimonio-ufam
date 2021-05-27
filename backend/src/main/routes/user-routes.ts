import { Router } from 'express'
import ExpressRouteAdapterFactory from '../factories/adapter/express-route-adapter-factory'
import { CheckRecoverPasswordControllerFactory } from '../factories/controller/user/check-recover-password-factory'
import { makeRecoverPasswordController } from '../factories/controller/user/password-recovery-factory'
import { makeAuthenticationController } from '../factories/controller/user/user-authentication-factory'

export default (router: Router): void => {
  router.post('/login', ExpressRouteAdapterFactory(makeAuthenticationController()))
  router.get('/recover/:link', ExpressRouteAdapterFactory(CheckRecoverPasswordControllerFactory()))
  router.post('/recover', ExpressRouteAdapterFactory(makeRecoverPasswordController()))
}
