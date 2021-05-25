import { RecoverPasswordData } from '@/data/usecases/user/recover-password'
import { UserRecoverPassword } from '@/domain/usecase/user/user-recover-password'
import BcryptAdapter from '@/infra/bcrypt-adapter/bcrypt-adapter'
import { RecoverLink } from '@/infra/db/repositories/recover-link'
import { UserRepository } from '@/infra/db/repositories/user-repository'
export function buildRecoverPasswordData (): UserRecoverPassword {
  const dbLoadAccountByRegistration = new UserRepository()
  const hashComparer = new BcryptAdapter(12)
  const updateRecoverLink = new RecoverLink()
  return new RecoverPasswordData(dbLoadAccountByRegistration, hashComparer, updateRecoverLink)
}
