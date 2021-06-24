import { Router } from 'express'
import ExpressMiddlewareAdapterFactory from '../factories/adapter/express-middleware-adapter-factory'
import ExpressRouteAdapterFactory from '../factories/adapter/express-route-adapter-factory'
import { makeAuthMiddleware } from '../factories/middleware/auth-middleware-factory'
import { makeCreateResponsabilityStatementController } from '../factories/controller/responsability-statement/create-responsability-statement-factory'
import { makeListResponsabilityStatementsController } from '../factories/controller/responsability-statement/list-statements-controller-factory'
import { makeLoadStatementByIdController } from '../factories/controller/responsability-statement/load-statement-by-id-controller-factory'

export default (router: Router): void => {
  router.post('/statement/create',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware()),
    ExpressRouteAdapterFactory(makeCreateResponsabilityStatementController()))
  router.get('/statement-list/:page?',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware()),
    ExpressRouteAdapterFactory(makeListResponsabilityStatementsController()))
  router.get('/statement/:id',
    ExpressMiddlewareAdapterFactory(makeAuthMiddleware()),
    ExpressRouteAdapterFactory(makeLoadStatementByIdController()))
}
