import { UserPermission } from '@/domain/model/user'
import { Router } from 'express'
import ExpressMiddlewareAdapterFactory from '../factories/adapter/express-middleware-adapter-factory'
import ExpressRouteAdapterFactory from '../factories/adapter/express-route-adapter-factory'
import { makeAdminCreateNewUserController } from '../factories/controller/user/admin-create-new-user-factory'
import { CheckRecoverPasswordControllerFactory } from '../factories/controller/user/check-recover-password-factory'
import { makeRecoverPasswordController } from '../factories/controller/user/password-recovery-factory'
import { makeRecoverUpdateUserPasswordFactory } from '../factories/controller/user/recover-update-user-password-factory'
import { makeAuthenticationController } from '../factories/controller/user/user-authentication-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  router.post('/login', ExpressRouteAdapterFactory(makeAuthenticationController()))
  router.get('/recover/:link', ExpressRouteAdapterFactory(CheckRecoverPasswordControllerFactory()))
  router.post('/recover/:link', ExpressRouteAdapterFactory(makeRecoverUpdateUserPasswordFactory()))
  router.post('/recover', ExpressRouteAdapterFactory(makeRecoverPasswordController()))
  router.post('/users/create',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware(UserPermission.ADMINISTRATOR)),
    ExpressRouteAdapterFactory(makeAdminCreateNewUserController()))
}
