import { UserRecover } from '@/domain/model/user'

export interface DbLoadUserByRecoverLink {
  loadByLink(link: string): Promise<UserRecover>
}
