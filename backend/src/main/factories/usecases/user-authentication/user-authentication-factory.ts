import { AuthenticationData } from '@/data/usecases/user/auth-authentication'
import { UserAuthentication } from '@/domain/usecase/user/user-authentication'
import BcryptAdapter from '@/infra/bcrypt-adapter/bcrypt-adapter'
import { UserAccessTokenRepository } from '@/infra/db/repositories/user-access-token'
import { UserRepository } from '@/infra/db/repositories/user-repository'
import JwtAdapter from '@/infra/jwt-adapter/jwt-adapter'
import Env from '@/main/config/env'
export function buildAuthenticationData (): UserAuthentication {
  const dbLoadAccountByRegistration = new UserRepository()
  const hashComparer = new BcryptAdapter(12)
  const jwtGenerator = new JwtAdapter(Env.jwtSecret)
  const userTokenRepository = new UserAccessTokenRepository()
  return new AuthenticationData(dbLoadAccountByRegistration, hashComparer, jwtGenerator, userTokenRepository)
}
