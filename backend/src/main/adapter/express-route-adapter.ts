import { HttpController } from '@/presentation/protocols/http-controller'
import { HttpRequest } from '@/presentation/protocols/http'
import { Request, Response } from 'express'

export default function ExpressRouteAdapter (controller: HttpController) {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      query: request.query
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      response.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
