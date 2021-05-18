export interface User {
  id: string
  name: string
  registration: string
  email: string
  password: string
  permission: UserPermission
}

export enum UserPermission {
  INVENTORIOUS = 1, // inventariante
  ADMINISTRATOR = 2
}
