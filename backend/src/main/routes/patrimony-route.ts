import { UserPermission } from '@/domain/model/user'
import { Router } from 'express'
import ExpressMiddlewareAdapterFactory from '../factories/adapter/express-middleware-adapter-factory'
import ExpressRouteAdapterFactory from '../factories/adapter/express-route-adapter-factory'
import { makeCreateNewPatrimony } from '../factories/controller/patrimony/create-new-patrimony-factory'
import { makeListPatrimonyController } from '../factories/controller/patrimony/list-patrimony-controller-factory'
import { makeUpdatePatrimonyController } from '../factories/controller/patrimony/update-patrimony-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'

export default (router: Router): void => {
  router.post('/patrimony/create',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware(UserPermission.ADMINISTRATOR)),
    ExpressRouteAdapterFactory(makeCreateNewPatrimony()))
  router.post('/patrimony/update',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware(UserPermission.ADMINISTRATOR)),
    ExpressRouteAdapterFactory(makeUpdatePatrimonyController()))
  router.get('/patrimony/:page?',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware()),
    ExpressRouteAdapterFactory(makeListPatrimonyController()))
}
