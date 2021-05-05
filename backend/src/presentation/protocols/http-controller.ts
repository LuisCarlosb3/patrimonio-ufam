import { HttpRequest, HttpResponse } from './http'
export interface HttpController {
  handle (httpRequest: HttpRequest): Promise<HttpResponse>
}
