import { User, UserPermission } from '@/domain/model/user'

export interface LoadUserByToken {
  load(accessToken: string, permission?: UserPermission): Promise<User>
}
