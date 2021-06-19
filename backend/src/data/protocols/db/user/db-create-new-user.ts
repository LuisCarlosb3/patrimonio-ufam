import { User } from '@/domain/model/user'

export interface DbCreateNewUserModel extends Omit<User, 'id'>{}

export interface DbCreateNewUser {
  create(newUser: DbCreateNewUserModel): Promise<User>
}
