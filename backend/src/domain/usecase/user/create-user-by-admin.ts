import { User } from '@/domain/model/user'

export interface NewUserModel extends Omit<User, 'id' | 'password'> {}

export interface CreateNewUser {
  create(newUser: NewUserModel): Promise<User | string[]>
}
export interface CreateNewUserLink{
  create(userId: string): Promise<string>
}
