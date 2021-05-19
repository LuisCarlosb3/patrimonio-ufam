import { Router } from 'express'
import ExpressRouteAdapterFactory from '../factories/adapter/express-route-adapter-factory'
import { makeAuthenticationController } from '../factories/controller/user/user-authentication-factory'

export default (router: Router): void => {
  router.post('/login', ExpressRouteAdapterFactory(makeAuthenticationController()))
}
