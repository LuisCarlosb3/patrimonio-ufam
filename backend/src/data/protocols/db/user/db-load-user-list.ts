import { User } from '@/domain/model/user'

export interface DbLoadUserList {
  load(page: number, quantityPeerPage: number): Promise<User[]>
}
