import { CheckUserRecoverPassword } from '@/data/usecases/user/check-user-recover-password'
import { CheckUserRecoverLink } from '@/domain/usecase/user/user-recover-password'
import { RecoverLink } from '@/infra/db/repositories/recover-link'
export function buildCheckRecoverPasswordData (): CheckUserRecoverLink {
  const updateRecoverLink = new RecoverLink()
  return new CheckUserRecoverPassword(updateRecoverLink, updateRecoverLink)
}
