import { LoadUserListMode } from '@/domain/usecase/user/list-user'

export interface DbLoadUserList {
  load(page: number, quantityPeerPage: number): Promise<LoadUserListMode[]>
}
