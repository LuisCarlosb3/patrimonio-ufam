import ExpressMiddlewareAdapter from '@/main/adapter/express-middleware-adapter'
import { Middleware } from '@/presentation/protocols/middleware'

export default function ExpressMiddlewareAdapterFactory (middleware: Middleware): any {
  return ExpressMiddlewareAdapter(middleware)
}
