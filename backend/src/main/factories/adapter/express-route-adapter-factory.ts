import { HttpController } from '@/presentation/protocols/http-controller'
import ExpressRouteAdapter from '@/main/adapter/express-route-adapter'

export default function ExpressRouteAdapterFactory (controller: HttpController): any {
  return ExpressRouteAdapter(controller)
}
