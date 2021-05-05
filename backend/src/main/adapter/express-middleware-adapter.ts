import { Middleware } from '@/presentation/protocols/middleware'
import { Request, Response, NextFunction } from 'express'
import { HttpRequest } from '@/presentation/protocols/http'

export default function ExpressMiddlewareAdapter (middleware: Middleware) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: request.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode < 300) {
      request.body = { ...request.body, ...httpResponse.body }
      next()
    } else {
      response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
