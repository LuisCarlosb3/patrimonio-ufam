import { AuthMiddleware } from '@/presentation/middleware/authentication-middleware/auth-middleware'
import { makeLoadUserByTokenFactory } from '../usecases/auth-middleware/load-yser-by-token-factory'

export function makeAuthMiddleware (role?: number): AuthMiddleware {
  const loadUserByToken = makeLoadUserByTokenFactory()
  const auth = new AuthMiddleware(loadUserByToken, role)
  return auth
}
