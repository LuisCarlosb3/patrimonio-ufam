import { User } from '@/domain/model/user'

export interface NewUserModel extends Omit<User, 'id'> {}

export interface CreateNewUser {
  create(newUser: NewUserModel): Promise<User | string[]>
}
