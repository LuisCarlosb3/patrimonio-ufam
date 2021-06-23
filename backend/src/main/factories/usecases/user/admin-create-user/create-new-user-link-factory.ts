import { CreateNewUserLinkData } from '@/data/usecases/user/create-new-user-link'
import { CreateNewUserLink } from '@/domain/usecase/user/create-user-by-admin'
import { NewUserLinkRepository } from '@/infra/db/repositories/new-user-link'

export function makeCreateNewUserLinkFactory (): CreateNewUserLink {
  const dbCreateFirstLink = new NewUserLinkRepository()
  const createUserLink = new CreateNewUserLinkData(dbCreateFirstLink)
  return createUserLink
}
