import { LoadUserByTokenData } from '@/data/usecases/user/load-user-by-token'
import { LoadUserByToken } from '@/domain/usecase/user/load-user-by-token'
import { UserAccessTokenRepository } from '@/infra/db/repositories/user-access-token'
import JwtAdapter from '@/infra/jwt-adapter/jwt-adapter'
import Env from '@/main/config/env'
export function makeLoadUserByTokenFactory (): LoadUserByToken {
  const jwtDecrypter = new JwtAdapter(Env.jwtSecret)
  const loadUserByToken = new UserAccessTokenRepository()
  const loadByToken = new LoadUserByTokenData(jwtDecrypter, loadUserByToken)
  return loadByToken
}
